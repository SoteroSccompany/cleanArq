import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressEvent from "../customer-address.event";


export default class ConsoleLogTrocaEnderecoHandler implements EventHandlerInterface {

    handle(event: CustomerAddressEvent): void {
        console.log(`Endereço do cliente ${event.eventData.id}, ${event.eventData.name} foi alterado para ${event.eventData.Address}`);
    }
}