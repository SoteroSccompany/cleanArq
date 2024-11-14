import Customer from './domain/customer/entity/customer';
import Address from './domain/customer/value-object/address';


let custommer = new Customer("123", "Gabriel Sotero")
const address = new Address("Rua 1", 123, "Bh", "Mg", "30770400")
//Como e um objeto de valor, ele deve ser contante e ele nao pode ser setado diretamente 
//Se cria um objeto de address e inserte ele dentro de customer
custommer.Address = address;
custommer.activate();
//Isso aqui faz parte de um bloco de agregado 

// const item1 = new OrderItem("1", "item1","", 10)
// const item2 = new OrderItem("2", "item2","", 20)
// const order = new Order("1", "123", [item1, item2])
//Isso aqui faz parte de outro bloco agregado 


