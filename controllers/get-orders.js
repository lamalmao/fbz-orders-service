const { z } = require('zod');
const orders = require('../models/orders');
const users = require('../models/users');

const OrdersParams = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2021).max(2050),
  limit: z.number().min(1).optional()
});

const getOrdersController = async (req, res) => {
  try {
    const { month, year, limit } = OrdersParams.parse(req.body.params);

    const data = await orders.find(
      {
        $expr: {
          $and: [
            {
              $eq: [
                {
                  $month: {
                    $dateFromString: {
                      dateString: {
                        $toString: '$date'
                      }
                    }
                  }
                },
                month
              ]
            },
            {
              $eq: [
                {
                  $year: {
                    $dateFromString: {
                      dateString: {
                        $toString: '$date'
                      }
                    }
                  }
                },
                year
              ]
            },
            {
              $eq: ['$paid', true]
            }
          ]
        }
      },
      {
        orderID: 1,
        manager: 1,
        itemTitle: 1,
        client: 1,
        amount: 1,
        key: 1,
        refundStatus: 1,
        refundData: 1,
        status: 1,
        platform: 1,
        date: 1
      },
      {
        limit,
        sort: {
          date: -1
        }
      }
    );

    const count = data.length;
    const managers = new Map();
    const result = [];

    for (let i = 0; i < count; i++) {
      const id = data[i].manager;
      let managerName = managers.get(data[i].manager);
      if (!managerName) {
        const manager = await users.findOne(
          {
            telegramID: id
          },
          {
            username: 1
          }
        );

        managerName = manager ? manager.username || '-' : '-';
        managers.set(id, managerName);
      }

      result.push({
        ...data[i]._doc,
        managerName
      });
    }

    res.json({
      data: result,
      count
    });
  } catch (error) {
    console.log(error);

    res.status(500);
    res.json({
      error: error.message
    });
  }
};

module.exports = getOrdersController;