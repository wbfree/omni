test('Spread operator', () => {
    const fnc = (...args: Array<number>) => expect(args).toMatchObject([1, 2, 3, 4])
    fnc(1, 2, 3, 4)

    const args: Array<number> = [1, 2]
    expect(Math.min(...args)).toBe(1)
})

test('Template class and function', () => {
    class TemplateClass<T> {
        public prop: T
        constructor(param: T) {
            this.prop = param
        }
    };

    const typeInfoFnc = <T extends string = string>(param: T): TemplateClass<T> => {
        return new TemplateClass<string>(param) as TemplateClass<T>
    }

    const param: string = 'test'
    expect(typeInfoFnc(param).prop).toBe(param);

})

test('interface template overload', () => {

    interface testItf {
        <P = number | string>(...values: Array<P>): string
        (...values: Array<boolean>): string
        //(): testItf
    }

    const impl1: testItf = (...values: Array<any>) => '1'
    const impl2: testItf = (...values: Array<number> | Array<string> | Array<boolean>) => '2'

    expect(impl1(1, 2, 3)).toBe('1')
    expect(impl2('2', '1', '2')).toBe('2')

})

