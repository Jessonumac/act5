document.addEventListener("DOMContentLoaded", function () {
    const dataList = document.getElementById("data-list");
    const errorMessage = document.getElementById("error-message");
    const addForm = document.getElementById("add-form");
    const newItemInput = document.getElementById("new-item");

    let apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Replace with your API URL
    let items = [];

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();
            items = data.slice(0, 5);
            displayData(items);
        } catch (error) {
            handleErrorMessage(error);
        }
    }

    function displayData(data) {
        dataList.innerHTML = "";
        data.forEach(item => {
            const listItem = createListItem(item);
            dataList.appendChild(listItem);

            const editButton = listItem.querySelector(".edit-btn");
            const deleteButton = listItem.querySelector(".delete-btn");

            editButton.addEventListener("click", () => {
                editItem(item);
            });

            deleteButton.addEventListener("click", () => {
                deleteItem(item);
            });
        });
    }

    function createListItem(item) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span class="item-text">${item.title}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        return listItem;
    }

    function handleErrorMessage(error) {
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.classList.remove("hidden");
    }

    function addItem(title) {
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title
            })
        })
        .then(response => response.json())
        .then(data => {
            items.push(data);
            displayData(items);
        })
        .catch(error => {
            handleErrorMessage(error);
        });
    }

    function editItem(item) {
        const updatedTitle = prompt("Edit item:", item.title);
        if (updatedTitle !== null) {
            fetch(apiUrl + "/" + item.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: updatedTitle
                })
            })
            .then(response => response.json())
            .then(data => {
                item.title = data.title;
                displayData(items);
            })
            .catch(error => {
                handleErrorMessage(error);
            });
        }
    }

    function deleteItem(item) {
        fetch(apiUrl + "/" + item.id, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                const index = items.indexOf(item);
                if (index !== -1) {
                    items.splice(index, 1);
                    displayData(items);
                }
            } else {
                throw new Error("Delete request failed.");
            }
        })
        .catch(error => {
            handleErrorMessage(error);
        });
    }

    addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const newItemTitle = newItemInput.value.trim();
        if (newItemTitle !== "") {
            addItem(newItemTitle);
            newItemInput.value = "";
        }
    });

    fetchData();
});