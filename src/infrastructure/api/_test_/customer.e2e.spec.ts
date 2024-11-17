import { app, sequelize } from '../express';
import request from 'supertest';

describe("E2E test for customer", () => {

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("Should create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "Gabriel Sotero",
                address: {
                    street: "Rua 1",
                    number: 123,
                    city: "São Paulo",
                    state: "SP",
                    zip: "30770-400"
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Gabriel Sotero");
        expect(response.body.address.street).toBe("Rua 1");
        expect(response.body.address.number).toBe(123);
        expect(response.body.address.city).toBe("São Paulo");
        expect(response.body.address.state).toBe("SP");
        expect(response.body.address.zip).toBe("30770-400");

    });

    it("Should not create a customer", async () => {

        const response = await request(app)
            .post("/customer")
            .send({
                name: "Gabriel"
            });

        expect(response.status).toBe(500);

    });

    it("Should list all customers", async () => {

        const response = await request(app)
            .post("/customer")
            .send({
                name: "Gabriel Sotero",
                address: {
                    street: "Rua 1",
                    number: 123,
                    city: "São Paulo",
                    state: "SP",
                    zip: "30770-400"
                }
            });

        expect(response.status).toBe(200);

        const response2 = await request(app)
            .post("/customer")
            .send({
                name: "Gabriela Sotero",
                address: {
                    street: "Rua 2",
                    number: 123,
                    city: "São Paulo",
                    state: "SP",
                    zip: "30770-190"
                }
            });

        expect(response2.status).toBe(200);

        const listResponse = await request(app)
            .get("/customer").send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(3);

        const customer1 = listResponse.body.customers[1];
        expect(customer1.name).toBe("Gabriel Sotero");
        expect(customer1.address.street).toBe("Rua 1");

        const customer2 = listResponse.body.customers[2];
        expect(customer2.name).toBe("Gabriela Sotero");
        expect(customer2.address.street).toBe("Rua 2");

        const listResponseXML = await request(app)
            .get("/customer")
            .set('Accept', 'application/xml')
            .send();
        expect(listResponseXML.status).toBe(200);
        expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
        expect(listResponseXML.text).toContain(`<customers>`);
        expect(listResponseXML.text).toContain(`<customer>`);
        expect(listResponseXML.text).toContain(`<name>Gabriel Sotero</name>`);
        expect(listResponseXML.text).toContain(`<address>`);
        expect(listResponseXML.text).toContain(`<street>Rua 1</street>`);
        expect(listResponseXML.text).toContain(`<number>123</number>`);
        expect(listResponseXML.text).toContain(`<city>São Paulo</city>`);
        expect(listResponseXML.text).toContain(`<state>SP</state>`);
        expect(listResponseXML.text).toContain(`<zip>30770-400</zip>`);
        expect(listResponseXML.text).toContain(`</address>`);
        expect(listResponseXML.text).toContain(`</customer>`);
        expect(listResponseXML.text).toContain(`</customers>`);





    });

});