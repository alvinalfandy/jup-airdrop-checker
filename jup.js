const axios = require('axios');
const readlineSync = require('readline-sync');

function submitData(wallet) {
    const url = `https://airdrop-api.jup.ag/allocation/${wallet}`;
    return axios.get(url);
}

function printResult(wallet, amount) {
    if (amount > 0) {
        console.log(`Selamat! Alamat Anda ${wallet} memenuhi syarat untuk airdrop dengan jumlah ${amount} token finals.`);
    } else {
        console.log(`Nt mas, wallet maneh not eligible.`);
    }
}

async function main() {
    console.log(`
  ________  ________________ __ __________ 
 /  ___/ / / / ____/ ____/ //_// ____/ __ \\
 \\__ \\ / / / / __/ / /   / ,<  / __/ / /_/ /
  / __/ / /___/ /___/ /| |/ /___/ _, _/ 
 /____//_____/_____/_/ |_/____/_/ |_|
    
                                       BY: ALVIN ALFANDY

    `);

    while (true) {
        console.log("Pilih mode:");
        console.log("1. Menggunakan wallet.txt (isi wallet perbaris)");
        console.log("2. Input manual");
        console.log("3. Keluar");

        const mode = readlineSync.question("Masukkan pilihan (1/2/3): ");

        if (mode === "1") {
            try {
                const data = require('fs').readFileSync('wallet.txt', 'utf-8').split('\n').map(line => line.toLowerCase().trim());

                for (let i = 0; i < data.length; i++) {
                    const cleanLine = data[i];
                    console.log(`Baris ${i + 1}: ${cleanLine}`);

                    try {
                        const response = await submitData(cleanLine);

                        if (response.status === 200) {
                            const amount = response.data.tokens_final;
                            try {
                                const parsedAmount = parseInt(amount);
                                printResult(cleanLine, parsedAmount);
                            } catch (e) {
                                console.log(`Terjadi kesalahan dalam memproses amount untuk alamat ${cleanLine}.`);
                            }
                        } else {
                            console.log(`Terjadi kesalahan dalam memeriksa alamat ${cleanLine}. Status code: ${response.status}`);
                        }
                    } catch (error) {
                        console.log(`Terjadi kesalahan dalam memproses respons JSON untuk alamat ${cleanLine}: ${error.message}`);
                    }
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
        } else if (mode === "2") {
            while (true) {
                const wallet = readlineSync.question("Masukkan alamat Solana (atau ketik 'selesai' untuk keluar): ");
                if (wallet.toLowerCase() === 'selesai') {
                    break;
                }

                try {
                    const response = await submitData(wallet);

                    if (response.status === 200) {
                        const amount = response.data.tokens_final;
                        try {
                            const parsedAmount = parseInt(amount);
                            printResult(wallet, parsedAmount);
                        } catch (e) {
                            console.log(`Terjadi kesalahan dalam memproses amount untuk alamat ${wallet}.`);
                        }
                    } else {
                        console.log(`Terjadi kesalahan dalam memeriksa alamat ${wallet}. Status code: ${response.status}`);
                    }
                } catch (error) {
                    console.log(`Terjadi kesalahan dalam memproses respons JSON untuk alamat ${wallet}: ${error.message}`);
                }
            }
        } else if (mode === "3") {
            break;
        } else {
            console.log("Pilihan tidak valid.");
        }
    }
}

main();
