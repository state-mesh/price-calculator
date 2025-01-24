import React, {useState} from "react";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './index.css';
import {Card} from "primereact/card";
import {Slider} from "primereact/slider";
import {InputText} from "primereact/inputtext";
import {RadioButton} from "primereact/radiobutton";

const averageDaysInMonth = 30.437;
const averageHoursInAMonth = averageDaysInMonth * 24;

function getAWSPricing(zone, cpu, memory) {
    // Pricing obtained from https://aws.amazon.com/fargate/pricing/
    let cpuPrice = 0, memoryPrice = 0;

    // AWS does not support fractional CPU and memory, so we need to ceil the values
    cpu = Math.ceil(cpu);
    memory = Math.ceil(memory);

    switch (zone) {
        case "eu": {
            cpuPrice = 0.04048; // USD/thread-hour
            memoryPrice = 0.004445; // USD/GB-hour
            break;
        }
        case "sg": {
            cpuPrice = 0.05056; // USD/thread-hour
            memoryPrice = 0.00553; // USD/GB-hour
            break;
        }
    }
    return cpu * cpuPrice + memory * memoryPrice;
}

function getGCPPricing(zone, cpu, memory) {
    // Pricing obtained from https://cloud.google.com/compute/vm-instance-pricing#general-purpose_machine_type_family
    let cpuPrice = 0, memoryPrice = 0;

    // GCP does not support fractional CPU and memory, so we need to ceil the values
    cpu = Math.ceil(cpu);
    memory = Math.ceil(memory);

    switch (zone) {
        case "eu": {
            cpuPrice = 0.040887; // USD/thread-hour
            memoryPrice = 0.00464684; // USD/GB-hour
            break;
        }
        case "sg": {
            cpuPrice = 0.04274771; // USD/thread-hour
            memoryPrice = 0.004858311; // USD/GB-hour
            break;
        }
    }

    return cpu * cpuPrice + memory * memoryPrice;
}

function getAzurePricing(zone, cpu, memory) {
    // Pricing obtained from https://azure.microsoft.com/en-ca/pricing/details/container-instances/
    let cpuPrice = 0, memoryPrice = 0;

    // Azure does not support fractional CPU and memory, so we need to ceil the values
    cpu = Math.ceil(cpu);
    memory = Math.ceil(memory);

    switch (zone) {
        case "eu": {
            cpuPrice = 0.00511; // USD/thread-hour
            memoryPrice =  0.04656; // USD/GB-hour
            break;
        }
        case "sg": {
            cpuPrice = 0.00553; // USD/thread-hour
            memoryPrice = 0.05060; // USD/GB-hour
            break;
        }
    }

    return cpu * cpuPrice + memory * memoryPrice;
}

export default function App() {
    const AVG_CPU_PRICE_EU = 0.0035, AVG_RAM_PRICE_EU = 0.0005;
    const AVG_CPU_PRICE_SG = 0.0072, AVG_RAM_PRICE_SG = 0.0012;

    const [cpuCount, setCpuCount] = useState(1);
    const [memGb, setMemGb] = useState(1);
    const [zone, setZone] = useState("eu");

    let cost = 0;
    switch (zone) {
        case "eu": {
            cost = cpuCount * AVG_CPU_PRICE_EU + memGb * AVG_RAM_PRICE_EU;
            break;
        }
        case "sg": {
            cost = cpuCount * AVG_CPU_PRICE_SG + memGb * AVG_RAM_PRICE_SG;
            break;
        }
    }

    const costMonth = (cost * averageHoursInAMonth).toFixed(3);
    const awsPrice = getAWSPricing(zone, cpuCount, memGb);
    const awsMonthPrice = (awsPrice * averageHoursInAMonth).toFixed(3);
    const gcpPrice = getGCPPricing(zone, cpuCount, memGb);
    const gcpMonthPrice = (gcpPrice * averageHoursInAMonth).toFixed(3);
    const azurePrice = getAzurePricing(zone, cpuCount, memGb);
    const azureMonthPrice = (azurePrice * averageHoursInAMonth).toFixed(3);

    const priceDiffAws = ((awsPrice + gcpPrice + azurePrice) / 3 / cost).toFixed(0);

    return (
        <div className='p-3'>
            <div className='flex flex-column gap-1 pb-2 md:pb-4'>
                <p className='font-semibold m-0 text-2xl'>Estimate your costs</p>
                <p className='text-sm text-600 m-0'>Estimate your costs by selecting how much CPU, memory and storage
                    you need.</p>
            </div>

            <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex align-items-center">
                    <RadioButton inputId="eu" name="eu" value="eu"
                                 onChange={(e) => setZone(e.value)} checked={zone === 'eu'}/>
                    <label htmlFor="ingredient1" className="ml-2">Europe</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="sg" name="eu" value="sg"
                                 onChange={(e) => setZone(e.value)} checked={zone === 'sg'}/>
                    <label htmlFor="ingredient2" className="ml-2">Singapore</label>
                </div>
            </div>

            <div className='flex flex-column gap-2 pt-3 md:pt-0'>
                <p className='m-0 font-bold text-xl'>CPUs</p>
                <p className="m-0 text-sm font-medium text-600">The total number of CPUs your Application will
                    use</p>
            </div>
            <div className='flex align-items-center justify-content-between gap-2 px-2 pb-2 md:pb-4'>
                <Slider className='w-full' value={cpuCount} min={1} max={100} step={0.1}
                        onChange={(e) => setCpuCount(e.value)}/>
                <InputText className='w-4rem text-xl font-bold text-center' value={cpuCount.toString()}
                           onChange={(e) => setCpuCount(Number(e.target.value))}/>
            </div>

            <div className='flex flex-column gap-2'>
                <p className='m-0 font-bold text-xl'>Memory</p>
                <p className="m-0 text-sm font-medium text-600">The total amount of RAM your Application will
                    use</p>
            </div>
            <div className='flex align-items-center justify-content-between gap-2 px-2 pb-2 md:pb-4'>
                <Slider className='w-full' value={memGb} min={1} max={256} step={0.1}
                        onChange={(e) => setMemGb(e.value)}/>
                <InputText className='w-4rem text-xl font-bold text-center' value={memGb.toString()}
                           onChange={(e) => setMemGb(Number(e.target.value))}/>
            </div>


            <div className='flex flex-column md:flex-row align-items-center justify-content-around gap-3'>
                <Card className="priceCard w-10rem h-10rem mt-5" style={{border: '1px solid #2c9b27'}}>
                    <div className='flex flex-column justify-content-center align-items-center'>
                        <div>
                            <img className='w-5rem'
                                 src='https://sm-price-calculator.s3.eu-central-1.amazonaws.com/logo.jpg'/>
                        </div>
                        <p className='m-0 text-xl font-bold' style={{color: '#2c9b27'}}>${cost.toFixed(3)}<span
                            className='font-normal text-lg'> / h</span></p>
                        <p className='m-0 text-sm font-bold' style={{color: '#2c9b27'}}>${costMonth}<span
                            className='font-normal text-xs'> / month</span></p>
                    </div>
                </Card>
                <div className='text-center'>
                    <p className='m-0 pb-2 font-semibold text-red-400'>{priceDiffAws}x more expensive</p>
                    <hr className='m-0 pb-1'/>
                    <div className='flex flex-column md:flex-row align-items-center justify-content-around gap-3'>
                        <Card className="priceCard w-10rem h-10rem">
                            <div className='flex flex-column justify-content-center align-items-center'>
                                <div>
                                    <img className='w-5rem'
                                         src='https://sm-price-calculator.s3.eu-central-1.amazonaws.com/aws-logo.jpg'/>
                                </div>
                                <p className='m-0 text-xl font-semibold text-red-400'>${awsPrice.toFixed(3)}<span
                                    className='font-normal text-lg'> / h</span></p>
                                <p className='m-0 text-sm font-semibold text-red-400'
                                   style={{color: '#2c9b27'}}>${awsMonthPrice}<span
                                    className='font-normal text-xs'> / month</span></p>
                            </div>
                        </Card>
                        <Card className="priceCard w-10rem h-10rem">
                            <div className='flex flex-column justify-content-center align-items-center'>
                                <div>
                                    <img className='w-5rem'
                                         src='https://sm-price-calculator.s3.eu-central-1.amazonaws.com/gcp-logo.png'/>
                                </div>
                                <p className='m-0 text-xl font-semibold text-red-400'>${gcpPrice.toFixed(3)}<span
                                    className='font-normal text-lg'> / h</span></p>
                                <p className='m-0 text-sm font-semibold text-red-400'
                                   style={{color: '#2c9b27'}}>${gcpMonthPrice}<span
                                    className='font-normal text-xs'> / month</span></p>
                            </div>
                        </Card>
                        <Card className="priceCard w-10rem h-10rem">
                            <div className='flex flex-column justify-content-center align-items-center'>
                                <div>
                                    <img className='w-5rem'
                                         src='https://sm-price-calculator.s3.eu-central-1.amazonaws.com/azure-logo.jpg'/>
                                </div>
                                <p className='m-0 text-xl font-semibold text-red-400'>${azurePrice.toFixed(3)}<span
                                    className='font-normal text-lg'> / h</span></p>
                                <p className='m-0 text-sm font-semibold text-red-400'
                                   style={{color: '#2c9b27'}}>${azureMonthPrice}<span
                                    className='font-normal text-xs'> / month</span></p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

