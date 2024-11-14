import Address from "../../customer/value-object/address";
import Customer from "../../customer/entity/customer";
import CustomerEvent from "../../customer/event/customer.event";
import ConsoleLog1HandlerCreatedHandler from "../../customer/event/handler/console-log-1-handler-created.handler";
import ConsoleLog2HandlerCreatedHandler from "../../customer/event/handler/console-log-2-handler-created.handler";
import ConsoleLogTrocaEnderecoHandler from "../../customer/event/handler/console-log-troca-endereco.handler";
import CheckStokWhenProductIsCreated from "../../product/event/handler/check-stoque-when-product-is-created.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";
import CustomerAddressEvent from "../../customer/event/customer-address.event";


describe("Domain events tests", () => {

    it("Should register an event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

    });

    it("Should unregister an event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);

    });

    it("Should unregister all events handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();

    });

    it("Should notify all event handlers", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const eventHandler2 = new CheckStokWhenProductIsCreated();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 100,
            email: "teste@teste.com"
        });

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        eventDispatcher.register("ProductCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][1]).toMatchObject(eventHandler2);

        //Quando o notify for executado, o sendEmaulWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();



    });

    it("Should notify all event handlers when create customer", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new ConsoleLog1HandlerCreatedHandler();
        const eventHandler2 = new ConsoleLog2HandlerCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Rua 1", 123, "Bh", "MG", "30770400");
        customer.changeAddress(address);
        customer.activate();
        const customerEvent = new CustomerEvent(customer);

        eventDispatcher.register("CustomerEvent", eventHandler);
        eventDispatcher.register("CustomerEvent", eventHandler2);
        eventDispatcher.notify(customerEvent);
        expect(spyEventHandler).toHaveBeenCalled();

    });

    it("Should notify all event handlers when customer changeAddress", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new ConsoleLogTrocaEnderecoHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Rua 1", 123, "Bh", "MG", "30770400");
        customer.changeAddress(address);
        customer.activate();
        const address2 = new Address("Rua 2", 123, "Bh", "MG", "30770400");
        customer.changeAddress(address2);

        const customerEvent = new CustomerAddressEvent(customer);

        eventDispatcher.register("CustomerAddressEvent", eventHandler);

        eventDispatcher.notify(customerEvent);

        expect(spyEventHandler).toHaveBeenCalled();

    });

});