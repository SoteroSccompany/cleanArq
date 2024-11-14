import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ProductCreatedEvent from "../product-created.event";


export default class CheckStokWhenProductIsCreated implements EventHandlerInterface<ProductCreatedEvent> {

    handle(event: ProductCreatedEvent): void {
        console.log(`Check stok when product ${event.eventData.name} is created`);
    }

}