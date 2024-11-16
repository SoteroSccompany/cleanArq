import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import CustomerValidatorFactory from "../factory/customer.validator.factory";
import Address from "../value-object/address";


export default class Customer extends Entity {

    private _name: string;
    private _address!: Address;
    private _activate: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        super();
        this._id = id;
        this._name = name;
        this.validate();
        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    isActive(): boolean {
        return this._activate;
    }

    changeAddress(address: Address): void {
        this._address = address;
    }


    validate(): void {
        CustomerValidatorFactory.create().validate(this);
    }

    changeName(name: string): void {
        this._name = name;
        this.validate();
    }


    activate(): void {
        if (this._address === undefined) {
            throw new Error('Address is required');
        }
        this._activate = true;
    }

    deactivate(): void {
        this._activate = false;
    }

    addRewardPoints(points: number): void {
        const isActive = this.isActive();
        if (isActive) {
            this._rewardPoints += points;
        } else {
            throw new Error('Customer is not active');
        }
    }

    get points(): number {
        return this._rewardPoints;
    }


    get name(): string {
        return this._name;
    }

    get Address(): Address {
        return this._address;
    }

    get address(): Address {
        return this._address;
    }


    set Address(address: Address) {
        this._address = address;
    }




    /*
        // get id(): string {
        //     return this._id;
        // }

        // set id(id: string) {
        //     this._id = id;
        // }

        // set activate(activate: boolean) {   
        //     this._activate = activate;
        // }

        nao se pode ter isso, por nao expressar regras de negocio, metodos de get e set devem 
        ficar apenas em entidades anemicas.


        A diferenca aqui é que o activate tem uma intencao de negocio para ser alterada, sendo 
        a modificacao do estado de um cliente pela regra de negocio ou nao. Isso e uma regra de 
        negocio, um motivo pelo qual aquilo existe. 
    
    */

}