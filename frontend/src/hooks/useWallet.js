import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function useWallet() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(providerInstance);
        }
    }, []);

    const connectWallet = async () => {
        if (!provider) return alert("Please install a wallet like MetaMask");
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
    };

    return { account, provider, connectWallet };
}
