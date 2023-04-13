import Dropdown from 'react-bootstrap/Dropdown';

function DropDownMenu(){
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Dropdown Button
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
}

export default DropDownMenu;