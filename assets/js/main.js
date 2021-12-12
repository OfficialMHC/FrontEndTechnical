

/**----- SET DATA INTO LOCAL STORAGE -----**/
localStorage.setItem('frontEndTechnical', JSON.stringify(productData)); 





/**----- RETRIEVED DATA FROM LOCAL STORAGE -----**/
let retrievedData = localStorage.getItem('frontEndTechnical');





/**----- PRODUCTS SHOW INTO TABLE -----**/
products(JSON.parse(retrievedData))
document.querySelector('#btnBook').setAttribute('data-products', retrievedData);
document.querySelector('#btnReturn').setAttribute('data-products', retrievedData);




/**----- PRODUCTS METHOD -----**/
function products(data)
{
    let table = document.getElementById('productData');

    for(let i = 0; i < data.length; i++) {
        let row = ` <tr>
                        <td>${i+1}</td>
                        <td>${data[i].name}</td>
                        <td>${data[i].code}</td>
                        <td>${data[i].availability}</td>
                        <td>${data[i].needing_repair}</td>
                        <td>${data[i].durability}</td>
                        <td>${data[i].mileage}</td>
                    </tr> `

        table.innerHTML += row;
    }
}       




/**----- DECLARE ELEMENTS -----**/
const searchBox = document.getElementById('search');
const table = document.getElementById("productTable");
const trs = table.tBodies[0].getElementsByTagName("tr");

searchBox.addEventListener('keyup', searchProduct);




/**----- SEARCH PRODUCT METHOD -----**/
function searchProduct() {

    let filter = searchBox.value.toUpperCase();

    for (let rowI = 0; rowI < trs.length; rowI++) {
        let tds = trs[rowI].getElementsByTagName("td");

        trs[rowI].style.display = "none";

        for (let cellI = 0; cellI < tds.length; cellI++) {

            if (tds[cellI].innerHTML.toUpperCase().indexOf(filter) > -1) {
            
            trs[rowI].style.display = "";

            continue;
    
            }
        }
    }
}



/**----- SHOWING PRODUCTS INTO PRODUCT BOOK MODAL -----**/
$('#productBookOrReturn').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget)
    let getProducts = button.data('products');
    let getDataType = button.data('type');

    $('#dataType').val(getDataType);

    if (getDataType == 'Returned') {
        $('#productBookOrReturnLabel').html('<i class="bi bi-arrow-return-right"></i>  Return a Product')
    }

    let products = document.getElementById('products');

    for (var i = 0; i < getProducts.length; i++) {
        products.innerHTML = products.innerHTML + '<option value="' + getProducts[i].name + '" data-price="'+ getProducts[i].price +'" data-mileage="'+ getProducts[i].mileage +'" data-rental-period="'+ getProducts[i].minimum_rent_period +'">' + getProducts[i].name + ' / ' + getProducts[i].code + '</option>'
    }
})




/**----- GET PRODUCT INFO METHOD -----**/
function getProductInfo(obj)
{
    let productName = obj.options[obj.selectedIndex].value;
    let productPrice = obj.options[obj.selectedIndex].getAttribute('data-price');
    let productMileage = obj.options[obj.selectedIndex].getAttribute('data-mileage');

    document.getElementById('selectedProductName').value=productName;
    document.getElementById('selectedProductPrice').value=productPrice;
    document.getElementById('selectedProductMileage').value='Mileage: '+productMileage
}




/**----- PRODUCT BOOK OR RETURN METHOD -----**/
function productBookOrReturn()
{
    let fromDate = new Date(document.getElementById('fromDate').value);
    let toDate = new Date(document.getElementById('toDate').value);

    let Difference_In_Time = toDate.getTime() - fromDate.getTime();
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    if (Difference_In_Days < 1) {
        Difference_In_Days = 1
    }

    let productPrice = document.getElementById('selectedProductPrice').value;

    let estimatedPrice = productPrice * Difference_In_Days;
    document.getElementById('estimatedPrice').value=estimatedPrice;

    let productName = document.getElementById('selectedProductName').value;

    let getDataType = document.getElementById('dataType').value;




    // CALL CONFIRM ALERT METHOD //
    confirmationAlert(getDataType, productName, fromDate, toDate, estimatedPrice)
}




/**----- CONFIRM ALERT METHOD -----**/
function confirmationAlert(getDataType, productName, fromDate, toDate, estimatedPrice)
{
    let type = getDataType;
    if (getDataType == 'Returned') {
        type = getDataType;
    }

    if (productName == '') {
        Swal.fire('Please Select a Product')
    }else if (fromDate == 'Invalid Date') {
        Swal.fire('Please Select From Date')
    }else if (toDate == 'Invalid Date') {
        Swal.fire('Please Select To Date')
    }else if (fromDate > toDate) {
        Swal.fire('You can\'t select To Date before From Date')
    } else {

        Swal.fire({
            title: 'Your Estimated Price is $' + estimatedPrice +'.',
            text: "Do you want to procedure?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Procedure!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Success!',
                'Your Product has been ' + type + ' Successfully.',
                'success'
              )
    

              // CALL CREATE PRODUCT BOOK OR RETURN JSON METHOD //
              createProductBookOrReturnJSON(productName, estimatedPrice, type)
            }
        })



        document.getElementById('btnProductBookOrReturn').setAttribute('data-dismiss', 'modal')



        // CALL DISMISS MODAL METHOD //
        dismissModal()
    }
}




/**----- CREATE PRODUCT BOOK OR RETURN JSON METHOD -----**/
function createProductBookOrReturnJSON(name, price, type) {

    productBookOrReturnJSONObj = [];
    
    item = {}
    item ["productName"] = name;
    item ["estimatedPrice"] = price;

    productBookOrReturnJSONObj.push(item);

    if(type == 'Booked') {
        localStorage.setItem('productBookedData', JSON.stringify(productBookOrReturnJSONObj)); 
    } else {
        localStorage.setItem('productReturnedData', JSON.stringify(productBookOrReturnJSONObj)); 
    }
}




/**----- DISMISS MODAL METHOD -----**/
function dismissModal()
{
    document.getElementById('productBookOrReturnLabel').innerHTML='<i class="bi bi-bookmark-check"></i>  Book a Product'
    document.getElementById('fromDate').value=''
    document.getElementById('toDate').value=''
    document.getElementById('selectedProductName').value=''
    document.getElementById('selectedProductPrice').value=''
    document.getElementById('estimatedPrice').value=''
    document.getElementById('products').value=''
    document.getElementById('selectedProductMileage').value='Mileage:'
    $('.select2').select2();
}