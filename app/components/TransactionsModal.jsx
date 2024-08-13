"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner'; // Assuming you are using 'sonner' for toast notifications

const TransactionsModal = ({ isVisible, onClose, onLoadTransaction }) => {
    const [transactions, setTransactions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [focused, setFocused] = useState(false);
    const transactionsRef = useRef([]);
    const [inputId, setInputId] = useState('');
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');

    const getCurrentUsername = () => {
        return localStorage.getItem('currentUsername');
    };

    useEffect(() => {
        if (isVisible) {
            const savedTransactions = JSON.parse(localStorage.getItem('savedTransactions')) || [];
            const currentUser = getCurrentUsername();
            const userTransactions = savedTransactions.filter(transaction => transaction.username === currentUser);
            setTransactions(userTransactions);
        }
    }, [isVisible]);

    useEffect(() => {
        if (inputId) {
            const transactionToLoad = transactions.find(transaction => transaction.id === parseInt(inputId));
            if (transactionToLoad) {
                onLoadTransaction(transactionToLoad.id);
                setSelectedIndex(null); // Clear selected index
                onClose(); // Close the modal
            }
        }
    }, [inputId, transactions, onLoadTransaction, onClose]);

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Escape') {
                onClose();
            } else if (event.key === 'Enter' && selectedIndex !== null) {
                const transactionToLoad = transactions[selectedIndex];
                if (transactionToLoad) {
                    onLoadTransaction(transactionToLoad.id);
                    setSelectedIndex(null);
                    onClose();
                }
            } else if (event.key === 'ArrowDown') {
                setSelectedIndex(prevIndex => (prevIndex === null ? 0 : Math.min(prevIndex + 1, transactions.length - 1)));
            } else if (event.key === 'ArrowUp') {
                setSelectedIndex(prevIndex => (prevIndex === null ? 0 : Math.max(prevIndex - 1, 0)));
            } else if (event.altKey && event.key === 'v') {
                event.preventDefault();
                if (transactions.length > 0) {
                    handleVoidItems(transactions, true);
                }
                return;
            } else if (event.ctrlKey && event.key === 'F12') {
                event.preventDefault();
                onClose(); // You can implement modal open logic here
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [transactions, selectedIndex, onClose, onLoadTransaction]);

    useEffect(() => {
        if (focused && transactionsRef.current[selectedIndex]) {
            transactionsRef.current[selectedIndex].focus();
        }
    }, [focused, selectedIndex]);


    const [itemToVoid, setItemToVoid] = useState(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);


    const handleVoidItems = (voidAll = false) => {
        console.log("handleVoidItems called with:", voidAll);

        if (voidAll) {
            setItemToVoid(transactions);
            setSelectedItemIndex(null);
        }
        setShowVoidModal(true);
    };


    const handleVoidSubmit = async () => {
        if (itemToVoid && itemToVoid.length > 0) {
            if (itemToVoid.length === transactions.length) {
                // Void all items
                console.log("Voiding all items.");
                setTransactions([]); // Clear all transactions
            } else {
                console.log("No item selected or index out of range.");
            }

            // Close the modal and reset the state
            setShowVoidModal(false);
            setAdminPassword('');
            setItemToVoid(null);

            toast.success('Transactions voided successfully.');
        } else {
            console.log("itemToVoid is null or empty.");
            toast.error('No items to void.');
        }
    };



    const handleAdminPasswordChange = async (e) => {
        const url = localStorage.getItem("url") + "user.php";

        const password = e.target.value;
        setAdminPassword(password);

        if (password.length > 0) {
            try {
                const response = await axios.post(url, new URLSearchParams({
                    operation: 'verifyAdminPassword',
                    json: JSON.stringify({ password: password })
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                const result = response.data;
                console.log('Server response:', result); // Log the full response

                if (result.status === 1) {
                    await handleVoidSubmit(); // Proceed to void items
                } else {
                    console.log('Invalid admin password:', result.message);
                    toast.error('Invalid admin password.');
                }
            } catch (error) {
                console.error('Error verifying admin password:', error);
                toast.error('Error verifying admin password.');
            }
        }
    };


    return (
        <>
            {isVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 text-black">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Saved Transactions</h2>
                            <button onClick={onClose} className="text-red-500 font-bold">Close</button>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold mb-2">Transactions List</h3>
                            <div className="overflow-y-auto max-h-96">
                                {transactions.length === 0 ? (
                                    <p>No transactions found.</p>
                                ) : (
                                    <table className="min-w-full bg-white">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border-b">ID</th>
                                                <th className="py-2 px-4 border-b">User</th>
                                                <th className="py-2 px-4 border-b">Date/Time</th>
                                                <th className="py-2 px-4 border-b">Items</th>
                                                <th className="py-2 px-4 border-b">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((transaction, index) => (
                                                <tr
                                                    key={index}
                                                    ref={el => transactionsRef.current[index] = el}
                                                    className={`cursor-pointer ${index === selectedIndex ? 'bg-gray-200' : ''}`}
                                                    onClick={() => {
                                                        setSelectedIndex(index);
                                                        setFocused(true);
                                                    }}
                                                    onMouseEnter={() => setSelectedIndex(index)}
                                                >
                                                    <td className="py-2 px-4 border-b">{transaction.id}</td>
                                                    <td className="py-2 px-4 border-b">{transaction.username}</td>
                                                    <td className="py-2 px-4 border-b">{transaction.dateTime}</td>
                                                    <td className="py-2 px-4 border-b">
                                                        <div className="overflow-y-auto max-h-40">
                                                            <table className="w-full border-collapse">
                                                                <tbody>
                                                                    {transaction.items.map((item, itemIndex) => (
                                                                        <tr key={itemIndex}>
                                                                            <td className="border-b px-2 py-1">{item.product}</td>
                                                                            <td className="border-b px-2 py-1">{item.quantity}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-4 border-b">${transaction.total.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showVoidModal && (

                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4">Void All Transactions</h2>
                        <p className="mb-4">Are you sure you want to void all transactions?</p>
                        <div className="mb-4">
                            <label htmlFor="adminPassword" className="block text-gray-700 mb-2">Admin Password</label>
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={handleAdminPasswordChange}
                                id="adminPassword"
                                className="border text-black rounded-md px-3 py-2 w-full"
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TransactionsModal;
