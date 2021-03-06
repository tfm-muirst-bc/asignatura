pragma solidity >=0.5.12 <0.6.0;

contract UpmCatalogo {
    
    address public owner;
    
    uint public numAsignaturas;
    address[] public listaAsignaturas;
    mapping(address => AsignaturaConNombre) public mapAsignaturas;

    struct AsignaturaConNombre {
        uint indexArray;
        string nombreAMostrar;
    }
    
    constructor() public {
        owner = msg.sender;
    }

    function actualizarOwner(address _newOwner) public soloOwner() {
        owner = _newOwner;
    }

    function miDireccion() public view returns(address _miDireccion) {
        _miDireccion = msg.sender;
    }

    function asignaturasLength() public view returns(uint _asignaturasLength) {
        _asignaturasLength = listaAsignaturas.length;
    }
    


    function anadirAsignatura(
        address _addrContractAsignatura,
        string memory _nombreAMostrar
    ) public soloOwner() {
        // comprobar que no esta ya añadida
        if (listaAsignaturas.length != 0) {
            uint indexArrayAsig = mapAsignaturas[_addrContractAsignatura].indexArray;
            require(_addrContractAsignatura != listaAsignaturas[indexArrayAsig], "anadirAsignatura - Asignatura ya creada.");
        }
        
        mapAsignaturas[_addrContractAsignatura] = AsignaturaConNombre(listaAsignaturas.length, _nombreAMostrar);
        listaAsignaturas.push(_addrContractAsignatura);
        
        numAsignaturas++;
    }
    
    function eliminarAsignatura(
        address _addrContractAsignatura
    ) public soloOwner() {
        // comprobar que esta creada la Asignatura
        require(numAsignaturas != 0, "eliminarAsignatura - No hay Asignaturas creadas.");
        uint indexArrayAsig = mapAsignaturas[_addrContractAsignatura].indexArray;
        require(_addrContractAsignatura == listaAsignaturas[indexArrayAsig], "eliminarAsignatura - Asignatura no creada.");
        
        delete mapAsignaturas[_addrContractAsignatura];
        // listaAsignaturas[indexArrayAsig] = address(0);
        delete listaAsignaturas[indexArrayAsig];
        
        numAsignaturas--;
    }



    modifier soloOwner() {
        require(msg.sender == owner, "Sólo el owner puede hacer esta operación.");
        _;
    }
    
}