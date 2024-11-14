import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerEvent from "../customer.event";


export default class ConsoleLog1HandlerCreatedHandler implements EventHandlerInterface {

    handle(event: CustomerEvent): void {
        console.log('Esse é o primeiro console.log do evento: CustomerCreated', event);
    }
}