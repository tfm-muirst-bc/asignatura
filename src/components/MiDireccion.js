import React from 'react';

import {copyToClipboard} from '../utils/funciones.js';

const MiDireccion = (props) => {

	return (
		<p>
			Mi dirección: <span className="code code-shadow">{props.miDireccion}</span>
			<button type="button" className="btn btn-outline-primary btn-copy" onClick={() => copyToClipboard(props.miDireccion)}>
				<i className="far fa-copy fa-lg"></i>
			</button>
			{
				props.miDireccion === props.owner
				?
				<span className="badge badge-primary">owner</span>
				:
				""
			}
		</p>
	);

}

export default MiDireccion;