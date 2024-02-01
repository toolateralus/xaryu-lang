const Opcode = {
    halt: 0,
    jmp: 1,
    mov: 2,
    lod: 3,
    add: 4,
    sub: 5,
    mul: 6,
    div: 7,
    cmpi: 8,
    nop: 9,
}

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
    pushInt(num) {
		return this.toInt(parseInt(num));
    }
	toInt(number) {
		const buffer = new ArrayBuffer(4);
		const view = new DataView(buffer);
		view.setInt32(0, number, true);
		const byteArray = new Uint8Array(buffer);
		this.machineCode = [...this.machineCode, ...byteArray];
	}
    assemble(code) {
        var ip = 0;
        this.machineCode = [];
        const lines = code.split("\n");

        lines.forEach((line) => {
            const tokens = line.split(" ");
            const opcode = tokens[0];
            
            if (line == '')
                return;
            
            switch (tokens.length) {
                case 1:
                    this.machineCode.push(Opcode[opcode]);
                    ip += 1;
                    break;
                case 2:
                    this.machineCode.push(Opcode[opcode]);
                    ip += 1;
                    this.pushInt(tokens[1])
                    ip += 4;
                    break;
                case 3:
                    this.machineCode.push(Opcode[opcode]);
                    ip += 1;
                    var t = tokens[1];
                    if (!t.includes(',')) {
                        throw new Error('Invalid instruction format : ' + line);
                    }
                    
                    t = t.replace(',','');
					this.pushInt(Register[t])
					
                    ip += 4;
					this.pushInt(tokens[2])
                    ip += 4;
                    break;
            }
        });
        return this.machineCode;
    }
}

let input = `lod a, 100
lod b, 100
mul
mov a, 600
halt`

const assembler = new Assembler();

console.debug(assembler.assemble(input))