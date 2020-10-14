import React from "react";

import ListGroup from "react-bootstrap/ListGroup";
import Table from 'react-bootstrap/Table';

import "./HomePage.scss";

const Queue = (waveStarted, users, pairings) => {
    return (
        <>
            { !waveStarted &&
                <ListGroup className="list">
                {users.map((user) => (
                    <ListGroup.Item>{user.tag}</ListGroup.Item>
                ))}
                </ListGroup>
            }
            { waveStarted &&
                <Table bordered>
                    {pairings.map((pair) => (
                        <tr>
                            <td>{pair[0].tag}</td>
                            <td>{pair[1].tag}</td>
                        </tr>
                    ))}
                </Table>
            }
        </>
    );
}

export default Queue;