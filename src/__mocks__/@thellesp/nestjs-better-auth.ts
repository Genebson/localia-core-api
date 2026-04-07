export function AllowAnonymous(): MethodDecorator & ClassDecorator {
	return (target: any, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
		return descriptor ?? target;
	};
}
