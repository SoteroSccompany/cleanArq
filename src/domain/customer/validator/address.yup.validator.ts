import ValidatorInterface from "../../@shared/validator/validator.interface";
import * as yup from 'yup';
import Address from "../value-object/address";

export default class AddressYupValidator implements ValidatorInterface<Address> {

    validate(entity: Address): void {
        try {
            yup.object()
                .shape({
                    street: yup.string().required("Street is required"),
                    city: yup.string().required("City is required"),
                    state: yup.string().required("State is required"),
                    zipCode: yup.string().required("ZipCode is required"),
                    number: yup.number().required("Number is required").min(1, "Number must be greater than 0")
                })
                .validateSync({
                    street: entity.street,
                    city: entity.city,
                    state: entity.state,
                    zipCode: entity.zipcode,
                    number: entity.number
                },
                    {
                        abortEarly: false
                    }
                );
        } catch (errors) {
            const e = errors as yup.ValidationError;
            e.inner.forEach((error) => {
                entity.notification.addError({
                    message: error.message,
                    context: 'Address'
                });
            });
        }
    }

}