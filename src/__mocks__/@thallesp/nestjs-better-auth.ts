export const AllowAnonymous = () => (target: object, key?: string | symbol, descriptor?: PropertyDescriptor) => {
	if (descriptor) {
		return descriptor;
	}
};

export const Session = () => (target: object, key?: string | symbol, paramIndex?: number) => {};

export default {
	AllowAnonymous,
	Session,
};
