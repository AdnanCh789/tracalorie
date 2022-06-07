// Srorage Controller
const StorageCtrl = (function() {
    //Private Methods


    //Public Methods
    return {
        storeItem : function(item) {
            let items =[];
            if (localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items =JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));  
            }

        },
        getItemsFromStorage : function () {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
                
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                
            }
            return items;
        },
        updateItemStorage : function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index) {
                if (updatedItem.id === item.id) {
                    items.splice(index,1,updatedItem); 
                }
            })
            items = localStorage.setItem('items', JSON.stringify(items));  
        },
        deleteItemFromStorage : function (id) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index) {
                if (id === item.id) {
                    items.splice(index,1); 
                }
            })
            items = localStorage.setItem('items', JSON.stringify(items)); 
        }
    }
}
)();

// Item Controller
const ItemCtrl = (function() {
// item constructor
const Item = function (id,name,calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
}

    // Data structure / State
    const data = {
        items : StorageCtrl.getItemsFromStorage(),
        currentItem : null,
        calories : 0
    }
    //Public Methods
    return {

        getItem : function () {
            return data.items;
        },
        addItem : function(name,calories) {
            let ID;
            if(data.items.length > 0) {
            ID = data.items[data.items.length -1].id+1;
            }
            else {
                ID = 0;
                }
            // calories into intteger
            calories = parseInt(calories);

            newItem = new Item(ID,name,calories);
            data.items.push(newItem);
            return newItem;
        }, 
        getTotalCalories : function() {
            let total = 0;
            data.items.forEach(function(item){
                total += item.calories;
            })
            data.totalCalories = total;
            return data.totalCalories;
        },
        getItemById : function(id) {
            let found;
            data.items.forEach(function(item){
                if(item.id === id) {
                    found = item;
                }

            })
            return found;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        updateItem : function(name, calories) {
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function(item){
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },
        deleteItem : function(id) {
            const ids = data.items.map(function(item){
                return item.id

            })

            const index = ids.indexOf(id);
            data.items.splice(index,1);
            
        },
        logData : function () {
            return data;
        }
    }


})();

// UI Controller
const UICtrl = (function() {

    const UISelectors = {
        itemList : '#item-list',
        listItems : '#item-list li',
        addBtn : '.add-btn',
        updateBtn : '.update-btn',
        deleteBtn : '.delete-btn',
        clearBtn : '.clear-btn',
        backBtn : '.back-btn',
        itemNameInput : '#item-name' ,
        itemCaloriesInput : '#item-calories',
        totalCalories : '.total-calories'
    }
    
    // public methods
    return {
        populateItemList : function(items) {
            let html = '';
            items.forEach(item => {
                html += ` <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li> `;
                
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput : function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value ,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem : function (item) {

            document.querySelector(UISelectors.itemList).style.display='block';
           const li = document.createElement('li');
           li.className = 'collection-item';
           li.id = `item-${item.id}`;
           li.innerHTML =  `<strong>${item.name}:</strong> <em>${item.calories} Calories</em> 
           <a href="#" class="secondary-content"><i class="edit-item fa fa-solid fa-pencil"></i></a>`
           document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);


        },

        clearInput : function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList : function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories : function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;

        },
        clearEditState : function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState : function() {
            
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();

        },
        updateListItem : function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id')

                if(itemID === `item-${item.id}`) {
                    
                    document.querySelector(`#item-${item.id}`).innerHTML =`<strong>${item.name}:</strong> <em>${item.calories} Calories</em> 
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-solid fa-pencil"></i></a>
                    `;
                }

            })
        },
        deleteItemList : function(id) {

            const itemID = `#item-${id}`;


            const item = document.querySelector(itemID);
            item.remove();

        },
       
        getSelectors : function () {
            return UISelectors;
        }

    }
    
})();

//App Controller
const App = (function(ItemCtrl,StorageCtrl,UICtrl) {

    // load event listners
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }});
    document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

    document.querySelector(UISelectors.backBtn).addEventListener('click',function(e){

        UICtrl.clearEditState();

        e.preventDefault();

    });

    document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

    }

    //item add submit listner
    const itemAddSubmit = function(e) {
    const input = UICtrl.getItemInput();
       if(input.name !== '' && input.calories !== '') {
           const newItem = ItemCtrl.addItem(input.name, input.calories);
           UICtrl.addListItem(newItem);
           const totalCalories = ItemCtrl.getTotalCalories();
           UICtrl.showTotalCalories(totalCalories);
           StorageCtrl.storeItem(newItem);
           UICtrl.clearInput();

       }

    e.preventDefault();
    }
        //item edit click
        const itemEditClick = function (e) {
            if(e.target.classList.contains('edit-item')) {
                const listId = e.target.parentNode.parentNode.id;
                const listIdArr = listId.split('-');
                const id = parseInt(listIdArr[1]);
    
                const itemToEdit = ItemCtrl.getItemById(id);
                ItemCtrl.setCurrentItem(itemToEdit);
                UICtrl.addItemToForm();  
             }
            e.preventDefault();
        }
         // item update submit
     const itemUpdateSubmit = function (e) {
        let found;
       const input = UICtrl.getItemInput();
       const updated = ItemCtrl.updateItem(input.name,input.calories);
       UICtrl.updateListItem(updated);
       const totalCalories = ItemCtrl.getTotalCalories();
          UICtrl.showTotalCalories(totalCalories);
          StorageCtrl.updateItemStorage(updated);
          UICtrl.clearEditState();
   
   e.preventDefault();     
    }
       // item delete submit 
       const itemDeleteSubmit = function(e) {
        const currentItem = ItemCtrl.getCurrentItem();  
        ItemCtrl.deleteItem(currentItem.id); 
        
        UICtrl.deleteItemList(currentItem.id);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        UICtrl.clearEditState();
 
          e.preventDefault();
      }
     

        // Public Method
    return {
    init : function() {
        UICtrl.clearEditState();

    // get items from data structure
    const items = ItemCtrl.getItem(); 
    if(items.length === 0) {
        UICtrl.hideList();  

    } else {
        
    // Populate item list
        UICtrl.populateItemList(items);
    }

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    loadEventListeners();
    }
}


})(ItemCtrl,StorageCtrl,UICtrl);


App.init();