import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import AddressValidatorFactory from "../factory/address.validator.factory";

export default class Address extends Entity {

    _street: string;
    _city: string;
    _state: string;
    _zipCode: string;
    _numeber: number;

    constructor(street: string, number: number, city: string, state: string, zipCode: string) {
        super();
        this._street = street;
        this._city = city;
        this._state = state;
        this._zipCode = zipCode;
        this._numeber = number;
        this.validate();
        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    validate(): void {
        AddressValidatorFactory.create().validate(this);
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