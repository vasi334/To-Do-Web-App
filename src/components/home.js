import { useState, useEffect, useRef } from 'react';
import styles from '../styles/home.module.css'
import Footer from './footer';
import Item from './item';


function HomeComponent(){

    let items = []

    const inputRef = useRef('');

    const [inputValue, setInputValue] = useState('');
    
    const [itemList, setItemList] = useState(items);
    
    const [boolActiveComplete, setBoolActiveComplete] = useState(null);
    
    const [selectedItem, setSelectedItem] = useState(null);
    
    const handleItemClick = (item) => {
        setSelectedItem(item);
        console.log(item);
    }
    
    const deleteItemHandler = async () => {
        try {
            await fetch(
                    `http://127.0.0.1:5000/item/${selectedItem.key}`, 
                    {
                    method: 'DELETE'
                    }
            );
        
            const filteredItemList = itemList.filter(item => item.key !== selectedItem.key);
            setItemList(filteredItemList);
            
        } catch (error) {
            console.log(error);
        }
    };

    const fetchItems = async () => {
        try{
            const response = await fetch("http://127.0.0.1:5000/item", 
            {
                method: "GET",
            })

            const itemsFetched = await response.json();
            setItemsFetched(itemsFetched);
            setBoolActiveComplete(null);

        } catch(error){
            console.log(error);
        }
    }

    useEffect(() => {

        fetchItems();

    }, [])

    const setItemsFetched = (itemsFetched) => {
        setItemList(itemsFetched["items"].reverse());
    }


    const addItemHandler = (item) => {
        setItemList((itemList) => {
            return [item, ...itemList];
        })
    }

    const submitHandler = async (event) => {

        if(event.key === "Enter")
        {
            const key = Date.now().toString();
    
            try{
                await fetch("http://127.0.0.1:5000/item", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({"key": key, "description": inputValue, "status": true}),
                })

                if(boolActiveComplete){
                    submitItemsActiveHandler();
                } else if(boolActiveComplete === false){
                    submitItemsCompletedHandler();
                }

                addItemHandler({"key": key, "description": inputValue, "status": true});

                inputRef.current.value = "";
                setInputValue('');

            } catch(error){
                console.log(error)
            }
        }
    };

    const submitItemsActiveHandler = () => {
        const fetchItemsActive = async () => {
            try{
                const response = await fetch("http://127.0.0.1:5000/itemsActive", 
                {
                    method: "GET",
                })
    
                const itemsFetched = await response.json();
                setBoolActiveComplete(true);
                setItemsFetched(itemsFetched);

            } catch(error){
                console.log(error);
            }
        }

        fetchItemsActive();
    };


    const submitItemsCompletedHandler = () => {
        const fetchItemsCompleted = async () => {
            try{
                const response = await fetch("http://127.0.0.1:5000/itemsCompleted", 
                {
                    method: "GET",
                })
    
                const itemsFetched = await response.json();
                setBoolActiveComplete(false);
                setItemsFetched(itemsFetched);

            } catch(error){
                console.log(error);
            }
        }

        fetchItemsCompleted();
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const setActiveHandler = () => {
        const setActive = async () => {
            try{
                fetch(
                        `http://127.0.0.1:5000/item/${selectedItem.key}`,
                        {
                            method : "PUT",
                            headers: { "Content-Type": "application/json"},
                            body: JSON.stringify({"status": true})
                        }
                    )

                const filteredItemList = itemList.filter(item => item.key !== selectedItem.key);
                setItemList(filteredItemList);
            } catch(error){
                console.log(error);
            }
        }

        setActive();
    }

    const setCompletedHandler = () => {
        const setCompleted = async () => {
            try{
                fetch(
                        `http://127.0.0.1:5000/item/${selectedItem.key}`,
                        {
                            method : "PUT",
                            headers: { "Content-Type": "application/json"},
                            body: JSON.stringify({"status": false})
                        }
                    )

                const filteredItemList = itemList.filter(item => item.key !== selectedItem.key);
                setItemList(filteredItemList);
            } catch(error){
                console.log(error);
            }
        }

        setCompleted();
    }


    return <>
    <div className={styles.flex}>
        <h1 className={styles.h1}>To Do List</h1>
        <div>
            <input
                ref={inputRef}
                placeholder="Add new" 
                htmlFor="input" 
                className={styles.input} 
                onChange={handleInputChange} 
                onKeyDown={submitHandler}></input>
            <ul>
                {itemList.map(item =>
                    <Item
                        key={item.key}
                        for={item.key} 
                        description={item.description}
                        onClick={() => handleItemClick(item)}
                    />
                )}
            </ul>
        </div>
        <Footer
            onClickSetActive={setActiveHandler}
            onClickSetCompleted={setCompletedHandler}
            onClickAll={fetchItems}
            onClickDelete={deleteItemHandler}
            onClickActive={submitItemsActiveHandler} 
            onClickCompleted={submitItemsCompletedHandler} 
            itemsLeft={itemList.length} />
    </div>
    </>
}

export default HomeComponent