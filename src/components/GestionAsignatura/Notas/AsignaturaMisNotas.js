import React from 'react';

import {Link} from "react-router-dom";

import {newContextComponents} from "drizzle-react-components";

import NavbarAsignatura from '../NavbarAsignatura';

import {copyToClipboard, shortenEthAddress} from '../../../utils/funciones.js';

const {ContractData} = newContextComponents;

class AsignaturaMisNotas extends React.Component {

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

		const instanceState = drizzleState.contracts[this.props.contractName];
		if (!instanceState || !instanceState.initialized) return;

		const instance = drizzle.contracts[this.props.contractName];

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

	render() {
		const {drizzle, drizzleState, isAlumno} = this.props;

		const instanceState = drizzleState.contracts[this.props.contractName];
		if (!this.state.ready || !instanceState || !instanceState.initialized) {
			return <span>Initializing...</span>;
		}

		const hayAlgunaNota = this.props.numNotas > 0;

		let listaNotas = [];
		if (hayAlgunaNota) {
			let theadtr = [];
			for (let i = 0; i < this.props.numEvaluaciones; i++) {
				theadtr.push(
					<th className="center">
						E<sub>{i}</sub> (
						<ContractData	key={"mn-e-" + i}
										drizzle={drizzle}
										drizzleState={drizzleState}
										contract={this.props.contractName}
										method={"listaEvaluaciones"}
										methodArgs={[i]}
										render={(evaluacion) => (
											<span>{evaluacion.nombre}</span>
										)} />
						)
					</th>
				);
			}

			let notasUnAlumno = [];
			for (let j = 0; j < this.props.numEvaluaciones; j++) {
				notasUnAlumno.push(
					<ContractData	key={"mn-" + j}
									drizzle={drizzle}
									drizzleState={drizzleState}
									contract={this.props.contractName}
									method={"mapNotas"}
									methodArgs={[this.props.miDireccion, j]}
									render={(nota) => (
										<td>
											{
												nota.existsNota
												?
												<>
													<span>{nota.tipoNota === "0" ? "NP" : ""}</span>
													<span>{nota.tipoNota === "1" ? (nota.calificacion / 10).toFixed(1) : ""}</span>
													<span>{nota.tipoNota === "2" ? (nota.calificacion / 10).toFixed(1) + " (MH)" : ""}</span>
												</>
												:
												""
											}
										</td>
									)} />
				);
			}

			let tbodyListaNotas = [];
			tbodyListaNotas.push(
				<tr>
					<td>
						Yo<Link to={`/gestion-alumnos/alumno/${this.props.miDireccion}`}> ({shortenEthAddress(this.props.miDireccion)})</Link>
						<button type="button" className="btn btn-outline-primary btn-copy" onClick={() => copyToClipboard(this.props.miDireccion)}>
							<i className="far fa-copy fa-lg"></i>
						</button>
					</td>
					{notasUnAlumno}
				</tr>
			);

			listaNotas =	<div className="table-responsive">
								<table className="table table-sm table-bordered table-hover">
									<thead className="thead-dark">
										<tr>
											<th className="center">A\E</th>
											{theadtr}
										</tr>
									</thead>

									<tbody className="center">
										{tbodyListaNotas}
									</tbody>
								</table>
							</div>;
		} else {
			listaNotas = <p>No hay ninguna nota mía</p>
		}

		if (isAlumno) {
			return (
				<>
					<NavbarAsignatura	addrEthAsig={this.props.addrEthAsig}
										isOwner={this.props.isOwner}
										isCoordinador={this.props.isCoordinador}
										isProfesor={this.props.isProfesor}
										isAlumno={this.props.isAlumno}
										active={"misNotas"} />

					<div className="card">
						<div className="card-header">
							<h4>Mis notas</h4>
						</div>

						<div className="card-body">
							<h5>Lista de mis notas</h5>
							{listaNotas}
						</div>
					</div>
				</>
			);
		} else {
			return (
				<NavbarAsignatura	addrEthAsig={this.props.addrEthAsig}
									isOwner={this.props.isOwner}
									isCoordinador={this.props.isCoordinador}
									isProfesor={this.props.isProfesor}
									isAlumno={this.props.isAlumno}
									active={"misNotas"} />
			);
		}
		
	}

}

export default AsignaturaMisNotas;