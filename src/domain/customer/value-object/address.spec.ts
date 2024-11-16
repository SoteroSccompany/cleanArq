import Address from "./address";



describe("Address unit test", () => {

    it("should throw error when street is empty", () => {

        expect(() => {
            let address = new Address("", 123, "city", "state", "zipCode")
        }).toThrow('Address: Street is required')
    });

    it("should throw error when number is empty", () => {

        expect(() => {
            let address = new Address("street", 0, "city", "state", "zipCode")
        }).toThrow('Address: Number must be greater than 0')
    });

    it("should throw error when city is empty", () => {

        expect(() => {
            let address = new Address("street", 123, "", "state", "zipCode")
        }).toThrow('Address: City is required')
    });

    it("should throw error when state is empty", () => {

        expect(() => {
            let address = new Address("street", 123, "city", "", "zipCode")
        }).toThrow('Address: State is required')
    });

    it("should throw error when zipCode is empty", () => {

        expect(() => {
            let address = new Address("street", 123, "city", "state", "")
        }).toThrow('Address: ZipCode is required')
    });

    it("should create address", () => {
        let address = new Address("street", 123, "city", "state", "zipCode")
        expect(address.street).toBe("street")
        expect(address.number).toBe(123)
        expect(address.city).toBe("city")
        expect(address.state).toBe("state")
        expect(address.zipcode).toBe("zipCode")
    });

    it("should throw error when all fields are empty", () => {

        expect(() => {
            let address = new Address("", 0, "", "", "")
        }).toThrow('Address: Street is required,Address: City is required,Address: State is required,Address: ZipCode is required,Address: Number must be greater than 0')
    });


});