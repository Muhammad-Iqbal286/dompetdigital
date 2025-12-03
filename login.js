// --- Hash function SHA-256 ---
async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// --- Kredensial dalam hash ---
const hiddenUserHash = "836dbaaa3869d2bd8344b8225331b1e8f00399cb145281d502f41b2666139dfe";
const hiddenPassHash = "7d8f8c13f9eb38fa05e2f1414ad0516649b02d9de5cbf5d3dd70d3ce237cf94d";

// --- Generate token random ---
function generateToken() {
    return [...crypto.getRandomValues(new Uint8Array(32))]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// --- Set Cookie Login ---
function setLoginCookie() {
    const token = generateToken();
    const expires = new Date(Date.now() + 3 * 60 * 60 * 1000).toUTCString(); // berlaku 3 jam
    document.cookie = `auth_token=${token}; expires=${expires}; path=/;`;
}

// --- Event login ---
document.getElementById("formLogin").addEventListener("submit", async function (e) {
    e.preventDefault();

    const u = document.getElementById("user").value;
    const p = document.getElementById("pass").value;

    const userHash = await sha256(u);
    const passHash = await sha256(p);

    if (userHash === hiddenUserHash && passHash === hiddenPassHash) {
        setLoginCookie();
        window.location.href = "keuangan.html";
    } else {
        document.getElementById("alert").classList.remove("d-none");
        setTimeout(() => {
            document.getElementById("alert").classList.add("d-none");
        }, 2000);
    }
});
