const TYPES = {
    NUL: 0,
    STR: 1,
    F32: 2,
};

/*
    desc: Convert character into ascii representation
    in: Character
    out: Number
    useage: chr2byte("a")
*/
export const chr2byte = (c) => String.prototype.charCodeAt.apply(c);

/*
    desc: Convert raw array into unsigned bytes for network communication
    in: Number | String | Null | ArrayObject
    out: Uint8Array
    useage: serialise([1, "2", null]) or serialise("data")
*/
export function serialise(arr) {
    let buffer = [];
    arr.forEach(node => {
        if (Number.isFinite(node)) {
            //number
            buffer.push(TYPES.F32);
            buffer.push(...new Uint8Array((new Float32Array([node])).buffer));
        } else if (typeof node === "string") {
            //string
            buffer.push(TYPES.STR);
            buffer.push(node.length);
            for (const chr in node) {
                buffer.push(chr2byte(node[chr]));
            }
        } else if (node === null) {
            //null
            buffer.push(TYPES.NUL);
        }
    });
    return new Uint8Array(buffer);
}

/*
    desc: Convert serialised Array-like object back to original form
    in: ArrayObject | Uint8Array
    out: ArrayObject
    useage: deserialise(new Uint8Array([1, 0]));
*/
export function deserialise(arr) {
    let buffer = [];
    let offset = 0;
    while (offset < arr.length) {
        switch (arr[offset]) {
            case TYPES.NUL:
                buffer.push(null);
                offset += 1;
                break;
            case TYPES.F32:
                let start = offset + 1;
                let bytes = new Uint8Array(arr.slice(start, start + 4));
                let f32 = new Float32Array(bytes.buffer);
                buffer.push(f32[0]);
                offset += 5;
                break;
            case TYPES.STR:
                let len = arr[offset + 1];
                let chrs = [];
                for (let i = 0; i < len; i++) {
                    chrs.push(String.fromCharCode(arr[offset + 2 + i]));
                }
                buffer.push(chrs.join(""));
                offset += (len + 2);
                break;
            default:
                console.log("Unsupported type :/");
                offset += 1;
                break;
        }
    }
    return buffer;
}
