import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface"
import OrderItem from "../../../../domain/checkout/entity/order_item";



export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        try {
            await OrderModel.create({
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    product_id: item.productId
                }))
            },
                {
                    include: [{ model: OrderItemModel }]
                }
            );
        } catch (error) {
            throw new Error(`Error to create a order`);
        }
    }

    async update(entity: Order): Promise<void> {
        try {
            await OrderModel.update({
                customer_id: entity.customerId,
                total: entity.total()
            }, {
                where: { id: entity.id },

            });
        } catch (error) {
            throw new Error(`Error to update a order`);
        }
    }

    async find(id: string): Promise<Order> {
        try {
            const orderModel = await OrderModel.findOne({
                where: { id },
                include: ["items"]
            });
            if (!orderModel) {
                throw new Error("Order not found");
            }
            const order = new Order(orderModel.id, orderModel.customer_id, orderModel.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)));
            return order;


        } catch (error) {
            throw new Error(`Error to find a order`);
        }
    }

    async findAll(): Promise<Order[]> {
        try {
            const orderModels = await OrderModel.findAll({
                include: ["items"]
            });
            const orders = orderModels.map(orderModel => {
                return new Order(
                    orderModel.id,
                    orderModel.customer_id,
                    orderModel.items.map(item => {
                        return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
                    })
                )
            });
            return orders;


        } catch (error) {
            throw new Error(`Error to find all orders`);
        }
    }

    async updateItems(entity: Order): Promise<void> {
        try {
            await OrderModel.update({
                total: entity.total()
            }, {
                where: { id: entity.id },
            });
            await Promise.all(entity.items.map(async item => {
                await OrderItemModel.update({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    product_id: item.productId
                }, {
                    where: { id: item.id }
                });
            }));
        } catch (error) {
            throw new Error(`Error to update a order item`);
        }
    }


    async findByOrderId(id: string): Promise<Order> {
        try {
            const orderModel = await OrderModel.findOne({
                where: { id },
                include: ["items"]
            });
            if (!orderModel) {
                throw new Error("Order not found");
            }
            const order = new Order(orderModel.id, orderModel.customer_id, orderModel.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)));
            return order;
        } catch (error) {
            const msg: string = (error as Error).message;
            throw new Error(msg);
        }
    }

    async findByItemId(id: string): Promise<Order> {
        try {
            const orderItem = await OrderItemModel.findOne({
                where: { id }
            });
            if (!orderItem) {
                throw new Error("Order item not found");
            }
            const orderModel = await OrderModel.findOne({
                where: { id: orderItem.order_id },
                include: ["items"]
            });
            return new Order(orderModel.id, orderModel.customer_id, orderModel.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)));
        } catch (error) {
            const msg: string = (error as Error).message;
            throw new Error(msg);
        }
    }

    async findItemByItemId(id: string): Promise<OrderItem> {
        try {
            const orderItem = await OrderItemModel.findOne({
                where: { id }
            });
            if (!orderItem) {
                throw new Error("Order item not found");
            }
            return new OrderItem(orderItem.id, orderItem.name, orderItem.price, orderItem.product_id, orderItem.quantity);
        } catch (error) {
            const msg: string = (error as Error).message;
            throw new Error(msg);
        }
    }

    async findAllItemsByOrderId(id: string): Promise<OrderItem[]> {
        try {
            const orderModel = await OrderModel.findOne({
                where: { id },
                include: ["items"]
            });
            if (!orderModel) {
                throw new Error("Order items not found");
            }
            return orderModel.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
        } catch (error) {
            const msg: string = (error as Error).message;
            throw new Error(msg);
        }
    }


}