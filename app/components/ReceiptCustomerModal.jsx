"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportsUserModal = ({ isVisible, onClose }) => {
    const [transactions, setTransactions] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalForToday, setTotalForToday] = useState(0);

    const username = localStorage.getItem('currentUsername');
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (isVisible) {
            setError(null);
            fetchShiftReport(userId);
        }
    }, [isVisible, userId]);

    const fetchShiftReport = async (userId) => {
        try {
            setLoading(true);

            const response = await axios.post('http://localhost/pos/sales.php', new URLSearchParams({
                operation: 'getShiftReport',
                json: JSON.stringify({ userId })
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const data = response.data;
            if (data && Array.isArray(data.sales)) {
                setTransactions(data.sales.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date)));
                setTotalForToday(parseFloat(data.total_for_today) || 0);
            } else {
                setError('Error fetching transactions');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const parseDate = (dateString) => {
        const parsedDate = new Date(Date.parse(dateString));
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    };

    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = parseDate(transaction.sale_date);
        const start = startDate ? new Date(startDate + 'T00:00:00') : null;
        const end = endDate ? new Date(endDate + 'T23:59:59') : null;

        return (
            (!filterName || transaction.user_username === filterName) &&
            (!start || transactionDate >= start) &&
            (!end || transactionDate <= end)
        );
    });

    const getTotalForDateRange = (transactions) => {
        return transactions.reduce((total, transaction) => total + transaction.sale_totalAmount, 0);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
            if (event.altKey && event.key === 'F3') {
                printContent('userTransactions', totalForToday);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, totalForToday]);


    const printContent = (contentId, totalForToday) => {
        const contentElement = document.getElementById(contentId);
        if (!contentElement) {
            console.error(`Element with ID ${contentId} not found.`);
            return;
        }

        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.sale_date);
            const start = startDate ? new Date(startDate + 'T00:00:00') : null;
            const end = endDate ? new Date(endDate + 'T23:59:59') : null;

            return (
                (!filterName || transaction.user_username === filterName) &&
                (!start || transactionDate >= start) &&
                (!end || transactionDate <= end)
            );
        });

        const printWindow = window.open('', '', 'height=600,width=300');
        const contentHtml = `
            <html>
                <head>
                    <title>Print Report</title>
                    <style>
                        body { font-family: monospace; }
                        .report-item { width: 300px; margin-bottom: 16px; }
                        .text-center { text-align: center; }
                    </style>
                </head>
                <body>
                    <div id="userTransactions" class="overflow-y-auto max-h-[700px] flex flex-col items-center">
                        ${filteredTransactions.length === 0 ? '<p>No transactions found.</p>' : filteredTransactions.map(transaction => `
                            <div class="border p-4 rounded report-item font-mono text-sm mb-4">
                                <p class="text-center font-bold">Macs Store</p>
                                <p class="text-center">------------------------------------</p>
                                <p><strong>User:</strong> ${transaction.user_username}</p>
                                <p><strong>Date/Time:</strong> ${transaction.sale_date}</p>
                                <p class="text-center">------------------------------------</p>
                                <p><strong>Total:</strong> ₱${transaction.sale_totalAmount.toFixed(2)}</p>
                                <p><strong>Cash Tendered:</strong> ₱${transaction.sale_cashTendered.toFixed(2)}</p>
                                <p><strong>Change:</strong> ₱${transaction.sale_change.toFixed(2)}</p>
                                <p class="text-center">------------------------------------</p>
                                <div>
                                    <p><strong>Items:</strong></p>
                                    <ul class="list-none pl-0">
                                        ${transaction.items.map(item => `
                                            <li>${item.product_name} - ${item.sale_item_quantity}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                                <p class="text-center">------------------------------------</p>
                                <p class="text-center">Thank you for shopping!</p>
                            </div>
                        `).join('')}
                    </div>
                </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(contentHtml);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };



    return (
        isVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 text-black">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">User Transaction Reports</h2>
                        <button onClick={onClose} className="text-red-500 font-bold">Close</button>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-xl font-bold">Total of Today's Transactions: ₱{totalForToday.toFixed(2)}</h3>

                    </div>
                    <div id="userTransactions" className="overflow-y-auto max-h-[700px] flex flex-col items-center">
                        {filteredTransactions.length === 0 ? (
                            <p>No transactions found.</p>
                        ) : (
                            filteredTransactions.map((transaction, index) => (
                                <div key={index} className="border p-4 rounded report-item font-mono text-sm w-[300px] mb-4">
                                    <p className="text-center font-bold">Macs Store</p>
                                    <p className="text-center">------------------------------------</p>
                                    <p><strong>User:</strong> {transaction.user_username}</p>
                                    <p><strong>Date/Time:</strong> {transaction.sale_date}</p>
                                    <p className="text-center">------------------------------------</p>
                                    <p><strong>Total:</strong> ₱{transaction.sale_totalAmount.toFixed(2)}</p>
                                    <p><strong>Cash Tendered:</strong> ₱{transaction.sale_cashTendered.toFixed(2)}</p>
                                    <p><strong>Change:</strong> ₱{transaction.sale_change.toFixed(2)}</p>
                                    <p className="text-center">------------------------------------</p>
                                    <div>
                                        <p><strong>Items:</strong></p>
                                        <ul className="list-none pl-0">
                                            {transaction.items.map((item, idx) => (
                                                <li key={idx}>{item.product_name} - {item.sale_item_quantity}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="text-center">------------------------------------</p>
                                    <p className="text-center">Thank you for shopping!</p>
                                </div>
                            ))
                        )}
                    </div>


                </div>
            </div>
        )
    );
};

export default ReportsUserModal;
