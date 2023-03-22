

function LoginFetch(props){

    var jsonData = {
      "users": [
          {
              "username" : props.username,
              "password" : props.password
          },
      ]
    }

    var formData = new FormData();
    formData.append('json1', JSON.stringify(jsonData1));
    formData.append('json2', JSON.stringify(jsonData2));

    // Send data to the backend via POST
    fetch('mongodb+srv://eg0547:6GeKD4a76qhbSzb@wsucluster0.3qpwigj.mongodb.net/?retryWrites=true&w=majority', {

      method: 'POST', 
      mode: 'cors', 
      body: formData // body data type must match "Content-Type" header

    })

}

export default LoginFetch;