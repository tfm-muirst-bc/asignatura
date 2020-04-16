import React from 'react';

import {useParams} from 'react-router-dom';

import MostrarAlumno from './MostrarAlumno';

const HookMostrarAlumno = (props) => {

	console.log('HookMostrarAlumno - useParams();', useParams());

	console.log('HookMostrarAlumno - props;', props);

	return (
		<>
			<MostrarAlumno 	drizzle={props.drizzle}
							drizzleState={props.drizzleState}
							miDireccion={props.miDireccion}
							owner={props.owner}
							addrEthAlum={useParams().addrEthAlum} />
		</>	
	);

}

export default HookMostrarAlumno;