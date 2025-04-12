import { NewableClass } from '../../../domain/NewableClass';
import { ValueObject } from '../../../domain/value-object/ValueObject';

export const ValueObjectTransformer = (ValueObjectClass: NewableClass<ValueObject<any>>) => ({
	to: (value: ValueObject<any>): any => value.value,
	from: (value: any): ValueObject<any> => new ValueObjectClass(value)
});
