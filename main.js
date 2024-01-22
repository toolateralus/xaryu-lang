const Instruction = {
    halt: 0,
    jmp: 1,
    str: 2,
    ld: 3,
    add: 4,
    sub: 5,
    mul: 6,
    div: 7,
    cmp: 8,
    nop: 9
};

const Register = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    sp: 7,
    ip: 8,
    r8: 9,
    r9: 10,
    r10: 11,
    rt: 12,
};

class Assembler {
    parseOperand(op) {
        if (op.startsWith("[")) {
            let slice = op.slice(1, op.length - 1);
            return parseInt(eval(slice));
        } else {
            return parseInt(op);
        }
    }
    assemble(code) {
        var ip = 0;
        let machineCode = [];
        const lines = code.split("\n");

        lines.forEach((line) => {
            const tokens = line.split(" ");
            const instruction = tokens[0];
            
            if (line == '')
                return;
            
            switch (tokens.length) {
                case 1:
                    machineCode.push(Instruction[instruction]); // single instruction
                    ip += 1;
                    break;
                case 2:
                    machineCode.push(Instruction[instruction]);
                    ip += 1;
                    machineCode.push(this.parseOperand(tokens[1])); // operand
                    ip += 4;
                    break;
                case 3:
                    machineCode.push(Instruction[instruction]);
                    ip += 1;
                    var t = tokens[1];
                    if (!t.includes(',')) {
                        throw new Error('Invalid instruction format : ' + line);
                    }
                    
                    machineCode.push(Register[t.replace(',','')]); // register
                    ip += 4;
                    machineCode.push(this.parseOperand(tokens[2])); // operand
                    ip += 4;
                    break;
            }
        });
        return machineCode;
    }
}

const assembler = new Assembler();
const machineCode = assembler.assemble(
`ld a, 2500
nop
nop
ld b, 2500
mul
str a, [4096/16]
`);

const fs = require('fs');

const filePath = process.argv[2];

fs.writeFileSync(filePath, new Uint8Array(machineCode));