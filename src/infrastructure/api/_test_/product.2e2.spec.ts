import { app, sequelize } from "../express";
import request from "supertest";

describe("E2e test for product", () => {

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });


    it("Should not list all products", async () => {
        const response = await request(app)
            .get(`/product`);

        expect(response.status).toBe(500);
    });


    it("Should list all products", async () => {
        const input1 = {
            name: "Product 1",
            price: 100,
            type: "a"
        }
        const response = await request(app)
            .post("/product")
            .send(input1);

        expect(response.status).toBe(200);

        const input2 = {
            name: "Product 2",
            price: 200,
            type: "b"
        }
        const response2 = await request(app)
            .post("/product")
            .send(input2);

        expect(response2.status).toBe(200);

        const response3 = await request(app)
            .get(`/product`);

        expect(response3.status).toBe(200);

        expect(response3.body.products.length).toBe(2);
        expect(response3.body.products[0].name).toBe("Product 1");
        expect(response3.body.products[0].price).toBe(100);
        expect(response3.body.products[1].name).toBe("Product 2");
        expect(response3.body.products[1].price).toBe(400);

    });


    it("Should find a product", async () => {
        const input1 = {
            name: "Product 1",
            price: 100,
            type: "a"
        }
        const response = await request(app)
            .post("/product")
            .send(input1);

        expect(response.status).toBe(200);

        const response2 = await request(app)
            .get(`/product/${response.body.id}`);

        expect(response2.status).toBe(200);
        expect(response2.body.name).toBe("Product 1");
        expect(response2.body.price).toBe(100);
    })

    it("Should not find a product", async () => {
        const response = await request(app)
            .get(`/product/1`);

        expect(response.status).toBe(500);
    });

    it("Should crete a product", async () => {
        //Name, price, type
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 100,
                type: "a"
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product 1");
        expect(response.body.price).toBe(100);
    });

    it("Should not create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 100
            });

        expect(response.status).toBe(500);
    });

    it("Should update a product", async () => {
        const input1 = {
            name: "Product 1",
            price: 100,
            type: "a"
        }
        const response = await request(app)
            .post("/product")
            .send(input1);

        expect(response.status).toBe(200);

        const input2 = {
            id: response.body.id,
            name: "Product 1 update",
            price: 200,
        }
        const response2 = await request(app)
            .put(`/product/${input2.id}`)
            .send(input2);

        expect(response2.status).toBe(200);
        expect(response2.body.name).toBe("Product 1 update");
        expect(response2.body.price).toBe(200);
    });


    it("Should not update a product", async () => {
        const input1 = {
            name: "Product 1",
            price: 100,
            type: "a"
        }
        const response = await request(app)
            .post("/product")
            .send(input1);

        expect(response.status).toBe(200);

        const input2 = {
            id: response.body.id
        }

        const response2 = await request(app)
            .put(`/product/${input2.id}`)
            .send(input2);

        expect(response2.status).toBe(500);
    });



});