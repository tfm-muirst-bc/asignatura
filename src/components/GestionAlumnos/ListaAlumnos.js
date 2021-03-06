import React from 'react';

import {Link} from "react-router-dom";

import {newContextComponents} from "drizzle-react-components";

import {copyToClipboard, shortenEthAddress} from '../../utils/funciones.js';

const {ContractData} = newContextComponents;

class ListaAlumnos extends React.Component {

	state = {
		ready: false,
		alumnosAddrsKeys: []
	};

	componentDidMount() {
		this.setState({
			ready: true,
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {drizzle, drizzleState} = this.props;

		const instanceState = drizzleState.contracts.UpmAlumnos;
		if (!instanceState || !instanceState.initialized) return;

		const instance = drizzle.contracts.UpmAlumnos;

		let changed = false;

		let {
			alumnosAddrsKeys
		} = JSON.parse(JSON.stringify(this.state));

		for (let i = alumnosAddrsKeys.length; i < this.props.alumnosLength; i++) {
			alumnosAddrsKeys[i] = instance.methods.listaAlumnos.cacheCall(i);
			changed = true;
		}

		if (changed) {
			this.setState({
				alumnosAddrsKeys,
			});
		}

	}

	eliminarAlumno = (addrEthAlum) => {
		const instance = this.props.drizzle.contracts.UpmAlumnos;

		instance.methods.borrarAlumnoAddr.cacheSend(
			addrEthAlum,
			{from: this.props.miDireccion}
		)
	}

	render() {
		const {drizzle, drizzleState} = this.props;

		const instanceState = drizzleState.contracts.UpmAlumnos;
		if (!this.state.ready || !instanceState || !instanceState.initialized) {
			return <span>Initializing...</span>;
		}

		let tbodyListaAlumnos = [];
		for (let i = 0; i < this.props.alumnosLength; i++) {
			let addrEthAlum = instanceState.listaAlumnos[this.state.alumnosAddrsKeys[i]];
			addrEthAlum = addrEthAlum ? addrEthAlum.value : "";

			if (addrEthAlum !== "" && addrEthAlum !== "0x0000000000000000000000000000000000000000") {
				tbodyListaAlumnos[i] = (
					<ContractData	key={i}
									drizzle={drizzle}
									drizzleState={drizzleState}
									contract={"UpmAlumnos"}
									method={"mapAlumnosAddr"}
									methodArgs={[addrEthAlum]}
									render={(alumno) => (
										<tr>
											<td>
												<Link to={`/gestion-alumnos/alumno/${addrEthAlum}`}>
													<span className="code">{shortenEthAddress(addrEthAlum)}</span>
												</Link>
												<button type="button" className="btn btn-outline-primary btn-copy" onClick={() => copyToClipboard(addrEthAlum)} title="Copiar dirección">
													<i className="far fa-copy fa-lg"></i>
												</button>
												{
													this.props.owner === this.props.miDireccion
													?
													<button type="button" className="btn btn-outline-danger btn-delete" onClick={() => this.eliminarAlumno(addrEthAlum)} title="Eliminar alumno">
														<i className="fas fa-trash-alt fa-lg" style={{color: "red"}}></i>
													</button>
													:
													""
												}
												{addrEthAlum === this.props.miDireccion ? <span className="badge badge-light">yo</span> : ""}
												
											</td>
											
											<td>{alumno.nombre}</td>
											
											<td>{alumno.apellidos}</td>
											
											<td>{alumno.correoUpm}</td>
										</tr>
									)}
					/>
				);
			}
		}

		const hayAlgunAlumno = this.props.numAlumnos > 0;

		if (hayAlgunAlumno) {
			return (
				<>
					<h4>Lista de alumnos creados</h4>

					<p>{this.props.numAlumnos} alumnos</p>

					<div className="table-responsive">
						<table className="table table-sm table-bordered table-hover">
							<thead className="thead-dark">
								<tr>
									<th>Dirección</th>

									<th>Nombre</th>

									<th>Apellidos</th>

									<th>Correo</th>
								</tr>
							</thead>
							
							<tbody>
								{tbodyListaAlumnos}
							</tbody>
						</table>
					</div>
				</>
			);
		} else {
			return (
				<h4>No hay ningún alumno creado</h4>
			);
		}

	}

}

export default ListaAlumnos;