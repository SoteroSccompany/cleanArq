import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../../domain/customer/repository/customer-repository.interface";
import CustomerModel from "./customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        try {
            await CustomerModel.create({
                id: entity.id,
                name: entity.name,
                street: entity.Address.street,
                number: entity.Address.number,
                city: entity.Address.city,
                state: entity.Address.state,
                zipcode: entity.Address.zipcode,
                active: entity.isActive(),
                rewardPoints: entity.points
            })
        } catch (error) {
            throw new Error(`Error to create a customer`);
        }
    }

    async update(entity: Customer): Promise<void> {
        try {
            await CustomerModel.update({
                name: entity.name,
                street: entity.Address.street,
                number: entity.Address.number,
                city: entity.Address.city,
                state: entity.Address.state,
                zipcode: entity.Address.zipcode,
                active: entity.isActive(),
                rewardPoints: entity.points
            }, {
                where: { id: entity.id }
            })
        } catch (error) {
            throw new Error(`Error to update a customer: ${(error as Error).message}`);
        }
    }

    async find(id: string): Promise<Customer> {
        try {
            const customerModel = await CustomerModel.findOne({ where: { id } });
            if (!customerModel) {
                throw new Error("Customer not found");
            }
            const customer = new Customer(customerModel.id, customerModel.name);
            const address = new Address(customerModel.street, customerModel.number, customerModel.city, customerModel.state, customerModel.zipcode);
            customer.changeAddress(address);
            if (customerModel.active) {
                customer.activate();
                customer.addRewardPoints(customerModel.rewardPoints)
            }
            return customer;

        } catch (error) {
            console.log(error)
            // throw new Error(`Error to find a customer: ${(error as Error).message}`);
            throw new Error(`Error to find a customer`);
        }
    }

    async findAll(): Promise<Customer[]> {
        try {
            const customerModels = await CustomerModel.findAll();
            return customerModels.map(customerModel => {
                const customer = new Customer(customerModel.id, customerModel.name);
                const address = new Address(customerModel.street, customerModel.number, customerModel.city, customerModel.state, customerModel.zipcode);
                customer.changeAddress(address);
                if (customerModel.active) {
                    customer.activate();
                    customer.addRewardPoints(customerModel.rewardPoints)
                }
                return customer;
            });
        } catch (error) {
            throw new Error(`Error to find all customers: ${(error as Error).message}`);
        }
    }

}