import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import Address from "../../../domain/customer/value-object/address";
import { InputUpdateCustomerDto, OutputUpdateCustomerDto } from "./update.customer.dto";



export default class CustomerUpdateUseCase {

    private customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository;
    }

    async execute(input: InputUpdateCustomerDto): Promise<OutputUpdateCustomerDto> {
        try {

            const customer = await this.customerRepository.find(input.id); //Caso nao ache o customer? 
            if (!customer) {
                throw new Error("Customer not found");
            }
            customer.changeName(input.name);
            const address = new Address(input.address.street, input.address.number, input.address.city, input.address.state, input.address.zip);
            customer.changeAddress(address);
            await this.customerRepository.update(customer);
            return {
                id: customer.id,
                name: customer.name,
                address: {
                    street: customer.Address.street,
                    number: customer.Address.number,
                    city: customer.Address.city,
                    state: customer.Address.state,
                    zip: customer.Address.zipcode
                }
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }


    }

}