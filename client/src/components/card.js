import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { HiOutlineUsers, HiOutlineBriefcase } from 'react-icons/hi';
import { RiRefund2Line, RiMoneyPoundCircleLine } from 'react-icons/ri';
import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import './card.css'
function InfoCard() {
    return (
        <CardGroup className="CardGroup" >
            <Card className='card' style={{ borderColor: "#d5dbe8" }}>
                <Card.Body>
                    <Card.Title className='title'><span className='number'>10,000</span>
                        <span class="icon-container" ><HiOutlineUsers /></span>
                    </Card.Title>
                    <Card.Text>
                        Total Users
                        <p><FiArrowUpRight class="arrow" /><span class="subtitle"> +1.01% this week</span></p>
                    </Card.Text>
                </Card.Body>

            </Card>
            <Card style={{ borderColor: "#d5dbe8" }}>

                <Card.Body>
                    <Card.Title className='title'><span className='number'>5,000</span> <span class="icon-container"><HiOutlineBriefcase /></span></Card.Title>
                    <Card.Text>
                        Total Orders
                        <p><FiArrowUpRight class="arrow" /><span class="subtitle"> +1.01% this week</span></p>
                    </Card.Text>
                </Card.Body>

            </Card>
            <Card style={{ borderColor: "#d5dbe8" }}>
                <Card.Body>
                    <Card.Title className='title'><span className='number'>100,000 </span><span class="icon-container" ><RiMoneyPoundCircleLine /></span></Card.Title>
                    <Card.Text>
                        Total Sales
                        <p><FiArrowUpRight class="arrow" /><span class="subtitle"> +1.01% this week</span></p>
                    </Card.Text>
                </Card.Body>

            </Card>
            <Card style={{ borderColor: "#d5dbe8" }}>
                <Card.Body>
                    <Card.Title className='title'><span className='number'>0000</span><span class="icon-container"><RiRefund2Line /></span></Card.Title>
                    <Card.Text>
                        Refunded
                        <p><FiArrowDownLeft class="arrow-red" /><span class="subtitle"> -1.01% this week</span></p>
                    </Card.Text>
                </Card.Body>

            </Card>
        </CardGroup >
    );
}

export default InfoCard;