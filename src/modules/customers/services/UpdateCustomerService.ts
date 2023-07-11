import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '../infra/typeorm/entities/Customer';
import CustomersRepository from '../infra/typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
}
export default class UpdateCustomerService {
  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const customer = await customersRepository.findById(id);

    if (!customer) throw new AppError('User not found');

    const customerExist = await customersRepository.findByEmail(email);

    if (customerExist && customer.email != email) {
      throw new AppError(
        'There is already one customer with this email on customer.',
      );
    }

    customer.name = name;
    customer.email = email;
    await customersRepository.save(customer);

    return customer;
  }
}
