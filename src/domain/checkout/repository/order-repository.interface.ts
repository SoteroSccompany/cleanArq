import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import RepositoryInterface from "../../@shared/repository/repository-interface";


export default interface OrderRepositoryInterface extends RepositoryInterface<Order> {
    updateItems(entity: Order): Promise<void>;
    findByOrderId(id: string): Promise<Order>;
    findByItemId(id: string): Promise<Order>;
    findItemByItemId(id: string): Promise<OrderItem>;
    findAllItemsByOrderId(id: string): Promise<OrderItem[]>;
}