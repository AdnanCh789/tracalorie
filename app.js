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
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();

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
            }

        });
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