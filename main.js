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

const fs = require('fs');

const assembler = new Assembler();

var iFile;
try {
    iFile = fs.readFileSync(process.argv[2], 'utf8');
}
catch (e) {
    console.error(`file read error: path=>"${process.argv[2]}"`)
    console.debug(e);
}

var machineCode
try {
    machineCode = assembler.assemble(iFile);
} 
catch (e) {
    console.error("assembler error: ")
    console.debug(e);
}

try {
    const oFile = process.argv[3];
    fs.writeFileSync(oFile, new Uint8Array(machineCode));
}
catch (e) {
    console.error(`file write error: path=>"${process.argv[3]}"`)
    console.debug(e);
}
