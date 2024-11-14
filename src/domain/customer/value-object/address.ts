
export default class Address {

    _street: string;
    _city: string;
    _state: string;
    _zipCode: string;
    _numeber: number;

    constructor(street: string, number: number, city: string, state: string, zipCode: string) {
        this._street = street;
        this._city = city;
        this._state = state;
        this._zipCode = zipCode;
        this._numeber = number;
        this.validate();
    }

    validate(): void {
        if (this._street.length === 0) {
            throw new Error('Street is required');
        }
        if (this._city.length === 0) {
            throw new Error('City is required');
        }
        if (this._state.length === 0) {
            throw new Error('State is required');
        }
        if (this._zipCode.length === 0) {
            throw new Error('ZipCode is required');
        }
        if (this._numeber <= 0) {
            throw new Error('Number is required');
        }
    }

    toString(): string {
        return `${this._street}, ${this._city}, ${this._state}, ${this._zipCode}, ${this._numeber}`;
    }

    get street(): string {
        return this._street;
    }

    get city(): string {
        return this._city;
    }

    get state(): string {
        return this._state;
    }

    get zipcode(): string {
        return this._zipCode;
    }

    get number(): number {
        return this._numeber;
    }
}