const TYPES = {
    NUL: 0,
    STR: 1,
    F32: 2,
};

export const chr2byte = (c) => String.prototype.charCodeAt.apply(c);

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
