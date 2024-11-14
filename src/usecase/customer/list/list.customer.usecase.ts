import Customer from "../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import { InputListCustomerDto, OutputListCustomerDto } from "./list.dto.customer.dto";


export default class ListCustomerUseCase {

    private customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository;
    }

    async execute(input: InputListCustomerDto): Promise<OutputListCustomerDto> {
        try {
            const customers = await this.customerRepository.findAll();
            return OutputMapper.toOutPut(customers);
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }


}

class OutputMapper {
    static toOutPut(customer: Customer[]): OutputListCustomerDto {
        return {
            customers: customer.map(customer => ({
                id: customer.id,
                name: customer.name,
                address: {
                    street: customer.Address.street,
                    number: customer.Address.number,
                    city: customer.Address.city,
                    state: customer.Address.state,
                    zip: customer.Address.zipcode
                }
            }))
        }


    }
}