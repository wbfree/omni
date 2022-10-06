import { useState, useEffect } from "react";

function _useState<Type>(arg: Type): any {
    //console.log(arg);
    return useState(arg);
}

export class _Component<Type> {
    protected value: Type;
    protected setter: any;

    constructor(refObj: Type) {
        const [value, setter] = _useState(refObj);
        this.value = value;
        this.setter = setter;
    }

    Set(value: Type = this.value): Type {
        this.setter(value);
        return value;
    }

    Get(): Type {
        return this.value;
    }
}

function _useEffect<Type>(component: _ComponentAPI<Type>): any {
    useEffect(() => {
        //console.log("useEffect");
        component.Fetch();
    }, []);
}

export class _ComponentAPI<Type extends Object> extends _Component<Type> {
    constructor(protected refObj: Type, protected url: string) {
        super(refObj);
        _useEffect(this);
    }

    Fetch(): void {
        fetch(this.url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                /* <-- data inferred as { data: T }*/
                //console.log(this.refObj);
                this.Set(data as Type);
            });
    }

    Get(): Type {
        Object.assign(this.refObj, this.value);
        return this.refObj;
    }
}
