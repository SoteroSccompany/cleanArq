

export interface InputCreateCustomerDto {
    name: string;
    address: {
        state: string;
        street: string;
        city: string;
        number: number;
        zip: string;
    }
}

export interface OutputCreateCustomerDto {
    id: string;
    name: string;
    address: {
        street: string;
        city: string;
        number: number;
        state: string;
        zip: string;
    }
}