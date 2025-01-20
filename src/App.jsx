import React, {useState} from "react";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './index.css';
import {Card} from "primereact/card";
import {Slider} from "primereact/slider";
import {InputText} from "primereact/inputtext";

function getAWSPricing(cpu, memory) {
    // Pricing obtained from https://aws.amazon.com/fargate/pricing/
    const cpuPrice = 0.04048; // USD/thread-hour
    const memoryPrice = 0.004445; // USD/GB-hour

    return cpu * cpuPrice + memory * memoryPrice;
}

function getGCPPricing(cpu, memory) {
    // Pricing obtained from https://cloud.google.com/kubernetes-engine/pricing
    const cpuPrice = 0.0445; // USD/thread-hour
    const memoryPrice = 0.0049225; // USD/GB-hour

    return cpu * cpuPrice + memory * memoryPrice;
}

function getAzurePricing(cpu, memory) {
    // Pricing obtained from https://azure.microsoft.com/en-ca/pricing/details/container-instances/
    const cpuPrice = 0.0486; // USD/thread-hour
    const memoryPrice = 0.00533; // USD/GB-hour

    return cpu * cpuPrice + memory * memoryPrice;
}

export default function App() {
    const AVG_CPU_PRICE = 0.0035;
    const AVG_RAM_PRICE = 0.0005;

    const [cpuCount, setCpuCount] = useState(1);
    const [memGb, setMemGb] = useState(1);

    const cost = (cpuCount * AVG_CPU_PRICE + memGb * AVG_RAM_PRICE).toFixed(3);
    const awsPrice = getAWSPricing(cpuCount, memGb);
    const gcpPrice = getGCPPricing(cpuCount, memGb);
    const azurePrice = getAzurePricing(cpuCount, memGb);

    const priceDiffAws = (awsPrice / cost).toFixed(0);

    return (
        <div className='p-3 flex gap-8'>
            <div>
                <div className='flex flex-column gap-1 pb-2 md:pb-4'>
                    <p className='font-semibold m-0 text-2xl'>Estimate your costs</p>
                    <p className='text-sm text-600 m-0'>Estimate your costs by selecting how much CPU, memory and storage you need.</p>
                    <p className='text-sm text-600 m-0'><i><strong>Note:</strong> Costs are presented for the European region. Prices in other regions might be higher on StateMesh and all other clouds.</i></p>
                </div>

                <div className='flex flex-column gap-2 pt-3 md:pt-0'>
                    <p className='m-0 font-bold text-xl'>CPUs</p>
                    <p className="m-0 text-sm font-medium text-600">The total number of CPUs your Application will
                        use</p>
                </div>
                <div className='flex align-items-center justify-content-between gap-2 px-2 pb-2 md:pb-4'>
                    <Slider className='w-full' value={cpuCount} min={1} max={100} step={1}
                            onChange={(e) => setCpuCount(e.value)}/>
                    <InputText className='w-4rem text-xl font-bold text-center' value={cpuCount.toString()}
                               onChange={(e) => setCpuCount(e.target.value)}/>
                </div>

                <div className='flex flex-column gap-2'>
                    <p className='m-0 font-bold text-xl'>Memory</p>
                    <p className="m-0 text-sm font-medium text-600">The total amount of RAM your Application will
                        use</p>
                </div>
                <div className='flex align-items-center justify-content-between gap-2 px-2 pb-2 md:pb-4'>
                    <Slider className='w-full' value={memGb} min={1} max={256} step={1}
                            onChange={(e) => setMemGb(e.value)}/>
                    <InputText className='w-4rem text-xl font-bold text-center' value={memGb.toString()}
                               onChange={(e) => setMemGb(e.target.value)}/>
                </div>


                <div className='flex flex-column md:flex-row align-items-center justify-content-around gap-3'>
                    <Card className="priceCard w-10rem h-10rem mt-5" style={{border: '1px solid #2c9b27'}}>
                        <div className='flex flex-column justify-content-center align-items-center'>
                            <div>
                                <img className='w-5rem'
                                     src='https://sm-price-calculator.s3.eu-central-1.amazonaws.com/logo.jpg'/>
                            </div>
                            <p className='m-0 text-xl font-bold' style={{color: '#2c9b27'}}>${cost}<span
                                className='font-normal text-lg'> / h</span></p>
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
                                    <p className='m-0 text-xl font-semibold text-red-400'>${awsPrice.toFixed(2)}<span
                                        className='font-normal text-lg'> / h</span></p>
                                </div>
                            </Card>
                            <Card className="priceCard w-10rem h-10rem">
                                <div className='flex flex-column justify-content-center align-items-center'>
                                    <div>
                                        <img className='w-5rem'
                                             src='https://sm-price-calculator.s3.eu-central-1.amazonaws.com/gcp-logo.png'/>
                                    </div>
                                    <p className='m-0 text-xl font-semibold text-red-400'>${gcpPrice.toFixed(2)}<span
                                        className='font-normal text-lg'> / h</span></p>
                                </div>
                            </Card>
                            <Card className="priceCard w-10rem h-10rem">
                                <div className='flex flex-column justify-content-center align-items-center'>
                                    <div>
                                        <img className='w-5rem'
                                             src='https://sm-price-calculator.s3.eu-central-1.amazonaws.com/azure-logo.jpg'/>
                                    </div>
                                    <p className='m-0 text-xl font-semibold text-red-400'>${azurePrice.toFixed(2)}<span
                                        className='font-normal text-lg'> / h</span></p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

