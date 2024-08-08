"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';



import KeycapActions from '../components/KeycapActions';
import ReportsModal from '../components/ReportsModal';
import TransactionsModal from '../components/TransactionsModal';
import VoidModal from '../components/VoidModal';
import ReportsUserModal from '../components/ReportsUserModal';
import ReceiptCustomerModal from '../components/ReceiptCustomerModal';




const Dashboard = ({ isVisible, onClose }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [usernames, setUsernames] = useState([]);

    const [barcode, setBarcode] = useState('');
    const [product, setProduct] = useState('');
    const [price, setPrice] = useState('');
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [cashTendered, setCashTendered] = useState('');
    const [change, setChange] = useState('');
    const [fullname, setFullname] = useState('');
    const [role, setRole] = useState('');

    const [showVoidModal, setShowVoidModal] = useState(false);
    const [itemToVoid, setItemToVoid] = useState(null);
    const [adminPassword, setAdminPassword] = useState('');

    const [isVoidModalVisible, setIsVoidModalVisible] = useState(false);

    const [scanning, setScanning] = useState(false);
    const [scannedBarcode, setScannedBarcode] = useState('');

    const [selectedTransactionIndex, setSelectedTransactionIndex] = useState(null);

    const [showReportsModal, setShowReportsModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [isCashInputVisible, setIsCashInputVisible] = useState(false);

    const [showCustomerNameModal, setShowCustomerNameModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [customerName, setCustomerName] = useState('');

    const [showReportsUserModal, setShowReportsUserModal] = useState(false);
    const [showReceiptCustomerModal, setShowReceiptCustomerModal] = useState(false);

    const [hasUnsavedTransactions, setHasUnsavedTransactions] = useState(false);
    const [isTransactionLoaded, setIsTransactionLoaded] = useState(false);

    const [canLogout, setCanLogout] = useState(true);


    const [quantity, setQuantity] = useState('1');  // Initial value is '1'
    const quantityRef = useRef(null);

    const handleQuantityChange = (e) => {
        const newValue = e.target.value;
        if (/^\d*$/.test(newValue)) {
            setQuantity(newValue);
        }
    };


    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setIsAdmin(storedRole === 'admin');
    }, [role]);


    if (isLoggedIn) {
        return null;
    }

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            router.push('/');
        }
    }, []);



    const router = useRouter();

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setFullname(storedName);
        }

        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }

        // fetchUsers();
    }, []);








    // const fetchProductDetails = async (barcode) => {
    //     try {
    //         const response = await axios.get('http://localhost/listing/sampleData.php', {
    //             params: { type: 'products' }
    //         });
    //         const data = response.data;
    //         const productDetail = data.find(product => product.barcode === barcode);
    //         if (productDetail) {
    //             setProduct(productDetail.p_name);
    //             setPrice(productDetail.price);
    //             addItem(productDetail.p_name, productDetail.price);
    //         } else {
    //             setProduct('');
    //             setPrice('');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching product data:', error);
    //         alert('Error fetching product data.');
    //     }
    // };

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchAllProducts();
    }, []);

    useEffect(() => {
        if (quantity && barcode) {
            const product = products.find(prod => prod.prod_id === parseInt(barcode));
            if (product) {
                addItem(product.prod_name, product.prod_price);
            }
        }
    }, [quantity, barcode]);

    const fetchAllProducts = async () => {
        const url = localStorage.getItem("url") + "products.php";

        try {
            const response = await axios.post(url, new URLSearchParams({
                operation: 'getAllProduct',
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            console.log('Response:', response);
            console.log('Fetched data:', response.data);

            // Ensure response.data is in the correct format
            let data;
            if (typeof response.data === 'string') {
                // Attempt to parse response data if it's a string
                try {
                    data = JSON.parse(response.data);
                } catch (error) {
                    throw new Error('Error parsing JSON data: ' + error.message);
                }
            } else {
                // Use response.data directly if it's already an object/array
                data = response.data;
            }

            // Validate that data is an array
            if (Array.isArray(data)) {
                console.log('Parsed data:', data);
                setProducts(data);
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
            alert('Error fetching product data.');
        }
    };





    const addItem = (productName, productPrice) => {
        const parsedQuantity = parseFloat(quantity);
        const parsedPrice = parseFloat(productPrice);

        // Find the product based on the name
        const product = products.find(p => p.prod_name === productName);

        if (!product) {
            toast.error('Product not found');
            return;
        }

        const productId = product.prod_id;

        if (parsedQuantity > 0 && productName && productPrice) {
            setItems(prevItems => {
                const existingItemIndex = prevItems.findIndex(item => item.prod_id === productId);

                let updatedItems;

                if (existingItemIndex !== -1) {
                    updatedItems = prevItems.map((item, index) =>
                        index === existingItemIndex
                            ? {
                                ...item,
                                quantity: item.quantity + parsedQuantity,
                                amount: (item.quantity + parsedQuantity) * parsedPrice
                            }
                            : item
                    );
                } else {
                    const newItem = {
                        prod_id: productId, // Use the prod_id from fetched data
                        quantity: parsedQuantity,
                        product: productName,
                        price: parsedPrice,
                        amount: parsedQuantity * parsedPrice
                    };
                    updatedItems = [...prevItems, newItem];
                }

                const newTotal = updatedItems.reduce((acc, item) => acc + item.amount, 0);
                setTotal(newTotal);

                if (quantityRef.current) {
                    quantityRef.current.focus();
                }

                return updatedItems;
            });

            setQuantity('1');
            setBarcode('');
            if (quantityRef.current) {
                quantityRef.current.focus();
            }
        } else {
            toast.error('Quantity must be greater than 0');
        }
    };








    const [remainingBalance, setRemainingBalance] = useState(0);


    useEffect(() => {
        // Fetch the remaining balance when the component mounts
        const fetchRemainingBalance = async () => {
            const url = localStorage.getItem("url") + "balance.php";

            try {
                const response = await axios.post(url,
                    new URLSearchParams({
                        operation: 'getBeginningBalance'
                    }),
                    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
                );
                console.log('Response data:', response.data); // Log response data
                if (response.data && response.data.beginning_balance !== undefined) {
                    setRemainingBalance(response.data.beginning_balance || 0);
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching beginning balance:', error);
            }
        };




        fetchRemainingBalance();
    }, []);


    const [beginningBalance, setBeginningBalance] = useState(0);

    useEffect(() => {
        const fetchBeginningBalance = async () => {
            const url = localStorage.getItem("url") + "balance.php";

            try {
                const response = await axios.post(url, new URLSearchParams({
                    operation: 'getBeginningBalance'
                }), {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                if (response.data) {
                    setBeginningBalance(response.data.beginning_balance || 0);
                }
            } catch (error) {
                console.error('Error fetching beginning balance:', error);
            }
        };

        fetchBeginningBalance();
    }, []);




    const updateBeginningBalance = async (newBalance) => {
        const url = localStorage.getItem("url") + "balance.php";

        try {
            const response = await axios.post(url, new URLSearchParams({
                operation: 'updateBeginningBalance',
                json: JSON.stringify({ amount: newBalance })
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            if (response.data) {
                // Handle success (e.g., show a success message or refresh balance)
                console.log('Beginning balance updated successfully.');
            }
        } catch (error) {
            console.error('Error updating beginning balance:', error);
        }
    };





    const calculateChange = (cashAmount) => {
        const tendered = parseFloat(cashAmount);
        const totalAmount = total; // Assuming `total` is the amount to be paid
        if (tendered < totalAmount) {
            setChange('');
        } else {
            const change = tendered - totalAmount;
            setChange(change);
        }
    };

    useEffect(() => {
        if (cashTendered) {
            calculateChange(cashTendered);
        }
    }, [cashTendered]);






    const handleVoidItems = (itemsToVoid, voidAll = false) => {
        console.log("handleVoidItems called with:", itemsToVoid, voidAll);

        if (voidAll) {
            // Set all items to void
            setItemToVoid(items); // Assuming items is the full list of items
            setSelectedItemIndex(null); // No specific item selected
        } else {
            // Set specific item to void
            const index = items.findIndex(item => item === itemsToVoid);
            if (index !== -1) {
                setItemToVoid([itemsToVoid]);
                setSelectedItemIndex(index);
            } else {
                console.log("Item not found in list:", itemsToVoid);
            }
        }
        setShowVoidModal(true);
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
                    handleVoidSubmit(); // Or any other function you need to call
                } else {
                    console.log('Invalid admin password:', result.message);
                    // Optionally reset the password input
                    // setAdminPassword('');
                }
            } catch (error) {
                console.error('Error verifying admin password:', error);
                toast.error('Error verifying admin password.');
            }
        }
    };


    const handleVoidSubmit = () => {
        console.log("itemToVoid:", itemToVoid);
        console.log("selectedItemIndex:", selectedItemIndex);

        if (itemToVoid && itemToVoid.length > 0) {
            if (itemToVoid.length === items.length) {
                // Void all items
                console.log("Voiding all items.");
                setItems([]);
            } else if (selectedItemIndex !== null && selectedItemIndex < items.length) {
                // Void selected item
                console.log("Voiding selected item:", items[selectedItemIndex]);
                setItems(prevItems => prevItems.filter((_, index) => index !== selectedItemIndex));
            } else {
                console.log("No item selected or index out of range.");
            }

            // Close the modal and reset the state
            setShowVoidModal(false);
            setAdminPassword('');
            setItemToVoid(null);
            setSelectedItemIndex(null); // Reset selected item index
            setHasUnsavedTransactions(false);
            setIsTransactionLoaded(false);

            // Focus on the quantity input if available
            if (quantityRef.current) {
                quantityRef.current.focus();
            }
        } else {
            console.log("itemToVoid is null or empty.");
        }
    };








    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'V') {
                if (items.length > 0) {
                    handleVoidItems(items, true);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [items]);











    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true // Use 12-hour clock
        });
    };

    const handleSaveTransaction = () => {
        if (items.length === 0) {
            toast.error("No items to save. Please add items to the transaction.");
            return;
        }

        const username = getCurrentUsername();
        const savedTransactions = JSON.parse(localStorage.getItem('savedTransactions')) || [];
        const userTransactions = savedTransactions.filter(transaction => transaction.username === username);

        let newTransactionId;
        if (userTransactions.length === 0) {
            newTransactionId = 1;
        } else {
            const lastId = Math.max(...userTransactions.map(t => t.id));
            newTransactionId = lastId + 1;
        }

        // Get the current date-time and format it
        const dateTime = formatDateTime(new Date().toISOString());

        const newTransaction = {
            id: newTransactionId,
            items,
            total,
            username,
            dateTime
        };

        savedTransactions.push(newTransaction);
        localStorage.setItem('savedTransactions', JSON.stringify(savedTransactions));

        const allTransactions = JSON.parse(localStorage.getItem('savedTransactions')) || [];
        const allLastId = Math.max(...allTransactions.map(t => t.id), 0);
        localStorage.setItem('lastTransactionId', allLastId);

        setHasUnsavedTransactions(false);
        setIsTransactionLoaded(false);
        resetTransaction();
    };







    // const handleLoadTransaction = (transactionId) => {
    //     const transactions = JSON.parse(localStorage.getItem('savedTransactions')) || [];
    //     const transactionToLoad = transactions.find(transaction => transaction.id === transactionId);

    //     if (transactionToLoad) {
    //         setItems(transactionToLoad.items);
    //         setTotal(transactionToLoad.total);

    //         const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionId);
    //         localStorage.setItem('savedTransactions', JSON.stringify(updatedTransactions));
    //     } else {
    //         alert("No matching transaction found or it's not yours.");
    //     }

    //     setShowModal(false);
    // };



    const handleLoadTransaction = (id) => {
        if (items.length > 0) {
            // alert("Please complete the current transaction before loading another.");
            return;
        }

        const username = getCurrentUsername();
        const savedTransactions = JSON.parse(localStorage.getItem('savedTransactions')) || [];
        const filteredTransactions = savedTransactions.filter(transaction => transaction.username === username);

        const transactionToLoad = filteredTransactions.find(transaction => transaction.id === id);

        if (transactionToLoad) {
            setItems(transactionToLoad.items);
            setTotal(transactionToLoad.total);
            setIsTransactionLoaded(true);

            const updatedTransactions = savedTransactions.filter(transaction => transaction.id !== id);
            localStorage.setItem('savedTransactions', JSON.stringify(updatedTransactions));

            setSelectedTransactionIndex(null);
            setHasUnsavedTransactions(false);
        } else {
            alert("No matching transaction found or it's not yours.");
        }
    };





    useEffect(() => {
        console.log("Checking logout conditions...");
        if (hasUnsavedTransactions || isTransactionLoaded) {
            console.log("Unsaved transactions or loaded transactions present.");
            setCanLogout(false);
        } else {
            console.log("No transactions present.");
            setCanLogout(true);
        }
    }, [hasUnsavedTransactions, isTransactionLoaded]);



    useEffect(() => {
        const savedTransactions = JSON.parse(localStorage.getItem('savedTransactions')) || [];

        const username = getCurrentUsername();
        const userTransactions = savedTransactions.filter(transaction => transaction.username === username);

        if (userTransactions.length > 0) {
            setCanLogout(false);
        } else {
            setCanLogout(true);
        }
    }, []);




    const handleLogout = () => {
        const savedTransactions = JSON.parse(localStorage.getItem('savedTransactions')) || [];
        const username = getCurrentUsername();

        const userTransactions = savedTransactions.filter(transaction => transaction.username === username);

        if (userTransactions.length > 0) {

            toast.error("Please save or clear all transactions before logging out.");
            return;
        }


        console.log("Can Logout Check:", canLogout);
        if (!canLogout) {
            toast.error("Please save or clear all transactions before logging out.");
            return;
        }

        if (items.length > 0) {
            toast.error("Please save or clear all transactions before logging out.");
            return;
        }
        // Proceed with logout
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
        setFullname('');
        setRole('');
        setIsAdmin(false);
        localStorage.removeItem('isLoggedIn', 'true');


        localStorage.removeItem('name');
        localStorage.removeItem('role');
        localStorage.removeItem('currentUsername');
        localStorage.removeItem('user_id');

        router.push('/');
    };







    // const handleRemoveTransaction = (index) => {
    //     const updatedTransactions = savedTransactions.filter((_, i) => i !== index);
    //     localStorage.setItem('savedTransactions', JSON.stringify(updatedTransactions));
    //     setSavedTransactions(updatedTransactions);
    // };

    const resetTransaction = () => {
        setItems([]);
        setTotal(0);
        setHasUnsavedTransactions(false); // Reset flag correctly
        setIsTransactionLoaded(false); // Reset flag correctly
    };



    const handlePaidTransaction = async () => {
        const url = localStorage.getItem("url") + "sales.php";

        console.log("natawag");
        const cash = parseFloat(cashTendered);

        if (isNaN(cash) || cash < total) {
            toast.error('Invalid cash.');
            return;
        }

        const fullName = localStorage.getItem('name');
        const username = localStorage.getItem('currentUsername');
        const userId = localStorage.getItem('user_id');

        if (!userId) {
            alert('User ID is not available.');
            return;
        }


        if (items.length === 0) {
            toast.error('No items in the transaction. Please add items before proceeding.');
            return;
        }

        const transactionData = {
            master: {
                userId: parseInt(userId),
                cashTendered: cash,
                change,
                totalAmount: total
            },
            detail: items.map(item => ({
                productId: item.prod_id,
                quantity: item.quantity,
                price: item.price
            }))
        };


        if (change > beginningBalance) {
            toast.error('Insufficient balance to give change. Please ensure enough balance is available.');
            return;
        }

        try {
            const response = await axios.post(url, new URLSearchParams({
                json: JSON.stringify(transactionData),
                operation: 'saveTransaction'
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const result = response.data;
            if (result.success) {
                // alert('Transaction saved successfully.');

                const newBalance = beginningBalance - change + cash;
                await updateBeginningBalance(newBalance);
                setBeginningBalance(newBalance);


                setCashTendered('');
                setChange('');
                resetTransaction();
                toggleCashInputVisibility();

                if (quantityRef.current) {
                    quantityRef.current.focus();
                }
            } else {
                alert(`Failed to save transaction. Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            alert('Error saving transaction.');
        }
    };



    const calculateTotal = () => {
        const newTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    };

    // Update total when items change
    useEffect(() => {
        calculateTotal();
    }, [items]);






    const handleScan = (barcode) => {
        setScannedBarcode(barcode);

        fetchProductDetails(barcode);
    };

    const getCurrentUsername = () => {

        return localStorage.getItem('currentUsername');
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowVoidModal(false);
            }
        };

        if (showVoidModal) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showVoidModal]);


    const toggleCashInputVisibility = () => {
        setIsCashInputVisible(prevState => !prevState);
        if (quantityRef.current) {
            quantityRef.current.focus();
        }
    };


    const barcodeRef = useRef(null); 3


    const setQuantityRef = (element) => {
        quantityRef.current = element;
        console.log('Quantity ref set:', quantityRef.current);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === '1') {
                event.preventDefault();
                if (quantityRef.current) {
                    quantityRef.current.focus();
                } else {
                    console.error('quantityRef.current is null');
                }
                return;
            }

            if (event.ctrlKey && event.key === '2') {
                event.preventDefault();
                if (barcodeRef.current) {
                    barcodeRef.current.focus();
                } else {
                    console.error('quantityRef.current is null');
                }
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const [showTransactionsModal, setShowTransactionsModal] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'F12') {
                setShowTransactionsModal(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    // useEffect(() => {
    //     const handleKeyDown = (event) => {
    //         if (event.ctrlKey && event.key === 'F8') {
    //             setIsVoidModalVisible(true);
    //         }
    //     };

    //     window.addEventListener('keydown', handleKeyDown);

    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === ',') {
                setShowReportsUserModal(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowVoidModal(false);

                if (quantityRef.current) {
                    quantityRef.current.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const itemsRef = useRef([]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'F9') {
                event.preventDefault();
                setSelectedItemIndex(0); // Start selection at the first item
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedItemIndex(prevIndex => {
                    if (prevIndex !== null && prevIndex < items.length - 1) {
                        return prevIndex + 1;
                    }
                    return prevIndex;
                });
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedItemIndex(prevIndex => {
                    if (prevIndex !== null && prevIndex > 0) {
                        return prevIndex - 1;
                    }
                    return prevIndex;
                });
            } else if (event.key === 'Enter') {
                if (selectedItemIndex !== null) {
                    handleVoidItems(items[selectedItemIndex]); // Pass the selected item
                    setShowVoidModal(true);
                }
            } else if (event.key === 'Escape') {
                setSelectedItemIndex(null); // Deselect item
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedItemIndex, items]);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update the time every second

        return () => clearInterval(intervalId);

        // Clear the interval on component unmount
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    };



    const fetchShiftReport = async (userId) => {
        const url = localStorage.getItem("url") + "sales.php";

        try {
            setLoading(true);

            const response = await axios.post(url, new URLSearchParams({
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
                setTotalForToday(parseFloat(data.total_for_today) || 0); // Ensure total is a number
            } else {
                setError('Error fetching transactions');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };



    const [transactions, setTransactions] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterName, setFilterName] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            const url = localStorage.getItem("url") + "sales.php";

            try {

                const userId = localStorage.getItem('user_id');
                if (!userId) {
                    console.error('user_id not found in localStorage');
                    return;
                }

                // Fetch data
                const response = await axios.post(url, new URLSearchParams({
                    operation: 'getShiftReport',
                    json: JSON.stringify({ userId })
                }));

                console.log('Response data:', response.data); // Log the response data

                if (response.data.sales) {
                    setTransactions(response.data.sales);
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };

        fetchData();
    }, []); // No dependency array to run only on mount

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


    const transactionsEndRef = useRef(null);

    useEffect(() => {
        if (transactionsEndRef.current) {
            transactionsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [filteredTransactions]);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'F3') {
                setShowReceiptCustomerModal(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const increaseQuantity = (selectedItem) => {
        setItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.product === selectedItem.product
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                        amount: (item.quantity + 1) * item.price
                    }
                    : item
            );

            const newTotal = updatedItems.reduce((acc, item) => acc + item.amount, 0);
            setTotal(newTotal);
            return updatedItems;
        });
    };

    const decreaseQuantity = (selectedItem) => {
        setItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.product === selectedItem.product
                    ? {
                        ...item,
                        quantity: Math.max(item.quantity - 1, 1),
                        amount: Math.max(item.quantity - 1, 1) * item.price
                    }
                    : item
            );

            const newTotal = updatedItems.reduce((acc, item) => acc + item.amount, 0);
            setTotal(newTotal);
            return updatedItems;
        });
    };


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.altKey && event.key === '-') {
                event.preventDefault();
                if (selectedItemIndex !== null) {
                    decreaseQuantity(items[selectedItemIndex]);
                }
            } else if (event.altKey && event.key === '+') {
                event.preventDefault();
                if (selectedItemIndex !== null) {
                    increaseQuantity(items[selectedItemIndex]);
                }
            } else if (event.ctrlKey && event.key === 'F6') {
                event.preventDefault();
                setSelectedItemIndex(0); // Start selection at the first item
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedItemIndex(prevIndex => {
                    if (prevIndex !== null && prevIndex < items.length - 1) {
                        return prevIndex + 1;
                    }
                    return prevIndex;
                });
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedItemIndex(prevIndex => {
                    if (prevIndex !== null && prevIndex > 0) {
                        return prevIndex - 1;
                    }
                    return prevIndex;
                });
            } else if (event.key === 'Escape') {
                setSelectedItemIndex(null); // Deselect item
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedItemIndex, items]);



    const tableContainerRef = useRef(null);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.altKey) {
                if (event.key === 'ArrowLeft') {
                    // Scroll left
                    if (tableContainerRef.current) {
                        tableContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
                    }
                    event.preventDefault();
                } else if (event.key === 'ArrowRight') {
                    // Scroll right
                    if (tableContainerRef.current) {
                        tableContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
                    }
                    event.preventDefault();
                } else if (event.key === 'ArrowUp') {
                    // Scroll up
                    if (tableContainerRef.current) {
                        tableContainerRef.current.scrollBy({ top: -100, behavior: 'smooth' });
                    }
                    event.preventDefault();
                } else if (event.key === 'ArrowDown') {
                    // Scroll down
                    if (tableContainerRef.current) {
                        tableContainerRef.current.scrollBy({ top: 100, behavior: 'smooth' });
                    }
                    event.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const tableBarcodeContainerRef = useRef(null);



    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.altKey) {
                if (event.key === 'ArrowUp') {

                    if (tableBarcodeContainerRef.current) {
                        tableBarcodeContainerRef.current.scrollBy({ top: -100, behavior: 'smooth' });
                    }
                    event.preventDefault();
                } else if (event.key === 'ArrowDown') {

                    if (tableBarcodeContainerRef.current) {
                        tableBarcodeContainerRef.current.scrollBy({ top: 100, behavior: 'smooth' });
                    }
                    event.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);








    return (
        <>
            <KeycapActions
                handleVoidItems={handleVoidItems}
                handleSaveTransaction={handleSaveTransaction}
                handlePaidTransaction={handlePaidTransaction}
                handleLoadTransaction={handleLoadTransaction}
                items={items}
                handleLogout={handleLogout}
                setSelectedTransactionIndex={setSelectedTransactionIndex}
                selectedTransactionIndex={selectedTransactionIndex}
                setShowReportsModal={setShowReportsModal}
                isAdmin={isAdmin}
                toggleCashInputVisibility={toggleCashInputVisibility}
            />
            <ReportsModal isVisible={showReportsModal} onClose={() => setShowReportsModal(false)} />
            <TransactionsModal
                isVisible={showTransactionsModal}
                onClose={() => setShowTransactionsModal(false)}
                onLoadTransaction={handleLoadTransaction}
            />

            <ReportsUserModal
                isVisible={showReportsUserModal}
                onClose={() => setShowReportsUserModal(false)}
            />
            <TransactionsModal
                isVisible={showTransactionsModal}
                onClose={() => setShowTransactionsModal(false)}
                onLoadTransaction={handleLoadTransaction}
            />

            <VoidModal
                isVisible={isVoidModalVisible}
                onClose={() => setIsVoidModalVisible(false)}
                items={items}
                onVoidItem={handleVoidItems}
                adminPassword={adminPassword}
                onAdminPasswordChange={handleAdminPasswordChange}
            />

            <ReceiptCustomerModal
                isVisible={showReceiptCustomerModal}
                onClose={() => setShowReceiptCustomerModal(false)}
            />


            <div className="flex-grow bg-[#FFFDD0] p-4  min-h-screen">



                <div className="flex justify-between items-center p-4 bg-[#262673] shadow-md rounded-lg mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-300">Macs Store</h2>
                        <p className="text-xl text-gray-300">{formatDate(currentTime)} - {formatTime(currentTime)}</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-300">Welcome, {fullname}</h2>
                        <p className="text-xl font-medium text-gray-300">Remaining Balance: ₱{beginningBalance.toFixed(2)}</p>
                    </div>
                </div>

                {/* md:flex-row */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#FFFDD0]">
                    {/* Left Side */}
                    <div className="flex flex-col">
                        <div className="h-56 p-4 bg-[#262673] rounded-lg shadow-md mb-4">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="mb-4">
                                        <label htmlFor="quantity" className="block text-white font-bold mb-2">Quantity:</label>
                                        <input
                                            type="text"
                                            id="quantity"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            className="border text-black rounded-md px-3 py-2 w-full bg-gray-300"
                                            required
                                            autoFocus
                                            ref={quantityRef}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="barcode" className="block text-white font-bold mb-2">Barcode:</label>
                                        <input
                                            type="text"
                                            id="barcode"
                                            value={barcode}
                                            onChange={(e) => setBarcode(e.target.value)}
                                            className="border text-black rounded-md px-3 py-2 w-full bg-gray-300"
                                            required
                                            ref={barcodeRef}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="h-[450px] p-4 bg-[#FFFDD0] rounded-lg shadow-md">
                            {/* <div className="max-h-[400px] overflow-y-auto">
                                <div id="userTransactions" className="overflow-y-auto max-h-96">
                                    {filteredTransactions.length === 0 ? (
                                        <p>No transactions found.</p>
                                    ) : (
                                        filteredTransactions.slice().reverse().map((transaction, index) => (
                                            <div key={index} className="border p-4 rounded report-item font-mono text-sm">
                                                <p className="text-center font-bold">Macs Store</p>
                                                <p className="text-center">------------------------------------</p>
                                                <p><strong>User:</strong> {transaction.user_username}</p>
                                                <p><strong>Date/Time:</strong> {transaction.sale_date}</p>
                                                <p>------------------------------------</p>
                                                <p><strong>Total:</strong> ₱{transaction.sale_totalAmount.toFixed(2)}</p>
                                                <p><strong>Cash Tendered:</strong> ₱{transaction.sale_cashTendered.toFixed(2)}</p>
                                                <p><strong>Change:</strong> ₱{transaction.sale_change.toFixed(2)}</p>
                                                <p>------------------------------------</p>
                                                <div>
                                                    <strong>Items:</strong>
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
                            </div> */}
                            <div className="flex justify-center">
                                <div className="w-full p-4 bg-[#FFFDD0] rounded-lg shadow-md mt-2">
                                    <div
                                        ref={tableBarcodeContainerRef}
                                        className="max-h-[410px] overflow-auto"
                                        style={{ overflowX: 'auto', overflowY: 'auto' }} // Ensure both axes are scrollable
                                    >
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-[#262673] text-white">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Barcode</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product Name</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 text-black">
                                                {products.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="2" className="px-6 py-4 text-center text-gray-700">No products available</td>
                                                    </tr>
                                                ) : (
                                                    products.map((product, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-lg">{product.prod_id}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-lg">{product.prod_name}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col">
                        <div className="w-full p-4 bg-[#FFFDD0] rounded-lg shadow-md mb-4">
                            <div className="mb-4 flex justify-between items-center">
                                <h3 className="text-2xl text-gray-700 font-bold">Current Sale</h3>
                                <h3 className="text-3xl text-gray-700 font-bold">Total: ₱{total.toFixed(2)}</h3>
                            </div>
                            <div className="overflow-x-auto h-72">
                                <table className="min-w-full border text-black border-gray-200 shadow-md rounded-md bg-[#262673]">
                                    <thead className="bg-[#262673] text-white">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-base font-medium uppercase tracking-wider">ID</th>
                                            <th className="px-4 py-2 text-left text-base font-medium uppercase tracking-wider">Quantity</th>
                                            <th className="px-4 py-2 text-left text-base font-medium uppercase tracking-wider">Product</th>
                                            <th className="px-4 py-2 text-left text-base font-medium uppercase tracking-wider">Price</th>
                                            <th className="px-4 py-2 text-left text-base font-medium uppercase tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.length > 0 ? (
                                            items.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className={`cursor-pointer ${selectedItemIndex === index ? 'bg-yellow-200' : index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                                                    onClick={() => setSelectedItemIndex(index)}
                                                    ref={el => (itemsRef.current[index] = el)}
                                                >
                                                    <td className="px-4 py-2 text-lg">{item.prod_id}</td>
                                                    <td className="px-4 py-2 text-lg">{item.quantity}</td>
                                                    <td className="px-4 py-2 text-lg">{item.product}</td>
                                                    <td className="px-4 py-2 text-lg">₱{parseFloat(item.price).toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-lg">₱{parseFloat(item.amount).toFixed(2)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-2 text-lg text-center text-gray-700 bg-white">No products available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {isCashInputVisible && (
                                <div className="mt-2">
                                    <div className="flex justify-end">
                                        <div className="flex items-center">
                                            <label htmlFor="cashTendered" className="text-gray-700 font-bold mr-4 flex-shrink-0">Cash:</label>
                                            <input
                                                type="number"
                                                id="cashTendered"
                                                value={cashTendered}
                                                onChange={(e) => setCashTendered(e.target.value)}
                                                className="border text-black rounded-md px-3 py-2 w-32 bg-gray-200"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    {change !== '' && (
                                        <div className="mt-4 flex justify-end">
                                            <h3 className="text-3xl text-gray-700 font-bold">Change: ₱{change.toFixed(2)}</h3>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        <div className='flex justify-center'>
                            <div className="w-full p-4 bg-[#FFFDD0] rounded-lg shadow-md mt-2">
                                <div ref={tableContainerRef} className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <tbody className="bg-[#FFFDD0] divide-y divide-gray-200 text-black">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Ctrl + F1</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Cash Input</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Ctrl + F2</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Paid Transaction</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Ctrl + F3</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Receipt Customer</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Ctrl + ,</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Shift Report</td>
                                            </tr>
                                            <tr>
                                                {/* <td className="px-6 py-4 whitespace-nowrap text-base">Alt + F3</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Print Receipt</td> */}
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Ctrl + F6</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Increase/Decrease Quantity</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Alt + -</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Decrease Quantity</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Alt + ,</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Scroll shortcut keys</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Alt + +</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Increase Quantity</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Ctrl + F11</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Suspend</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Ctrl + F12</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Resume</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Alt + .</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Scroll shortcut keys</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Ctrl + F9</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Void</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Alt + F9</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Void All</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Ctrl + P</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base">Print Today Transactions</td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>




                    </div>
                </div>


            </div >

            {showVoidModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 text-black">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4">Void Item</h2>
                        <p className="mb-4">Are you sure you want to void this item?</p>
                        <div className="mb-4">
                            <label htmlFor="adminPassword" className="block text-gray-700 mb-2">Admin Password</label>
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={handleAdminPasswordChange}
                                id="adminPassword"
                                className="border text-black rounded-md px-3 py-2 w-full bg-white"
                                required
                                autoFocus
                            />
                        </div>

                    </div>
                </div>
            )
            }
        </>
    );
};

export default Dashboard;
