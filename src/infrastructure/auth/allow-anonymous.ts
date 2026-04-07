export function AllowAnonymous(): ClassDecorator & MethodDecorator {
	return (target: any, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
		return descriptor ?? target;
	};
}
